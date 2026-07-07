import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * 📩 Webhook principal (WhatsApp / Chat do site)
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async receiveMessage(@Body() body: any) {
    try {
      // ✅ normalizando entrada (ZAPI ou custom)
      const phone = this.extractPhone(body);
      const message = this.extractMessage(body);

      if (!phone || !message) {
        console.warn('⚠️ Payload inválido:', body);
        return { ok: false };
      }

      console.log('📨 Mensagem recebida:', { phone, message });

      await this.chatService.handleIncomingMessage(phone, message);

      return { ok: true };

    } catch (error) {
      console.error('❌ erro webhook:', error);
      return { ok: false };
    }
  }

  /**
   * 🧠 Extrai telefone (compatível com vários formatos)
   */
  private extractPhone(body: any): string {
    return (
      body.phone ||
      body.from ||
      body.sender ||
      body?.data?.from ||
      null
    );
  }

  /**
   * 💬 Extrai mensagem (compatível com APIs diferentes)
   */
  private extractMessage(body: any): string {
    return (
      body.message ||
      body.text ||
      body?.data?.message ||
      body?.data?.text ||
      null
    );
  }
}
