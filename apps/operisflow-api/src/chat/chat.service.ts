import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatService {

  private OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  private OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

  constructor(
    // injeta repositórios aqui se quiser depois
  ) {}

  // ================================
  //  ENTRADA PRINCIPAL
  // ================================
  async handleIncomingMessage(phone: string, message: string) {
    console.log(' Mensagem recebida:', phone, message);

    // 1. buscar ou criar conversa
    const conversation = await this.findOrCreateConversation(phone);

    // 2. salvar msg cliente
    await this.saveMessage(conversation.id, 'client', message);

    // 3. se humano assumiu → não usa IA
    if (conversation.status === 'human') {
      console.log('👨‍💻 Conversa já está sendo atendida por humano');
      return;
    }

    // 4. chamar IA
    const aiResponse = await this.askAI(message);

    // 5. salvar resposta bot
    await this.saveMessage(conversation.id, 'bot', aiResponse.text);

    // 6. detectar lead quente
    if (this.isHotLead(message, aiResponse.text)) {
      await this.notifyOwner(phone, message);
    }

    // 7. responder cliente (WhatsApp / API)
    await this.replyToClient(phone, aiResponse.text);
  }

  // ================================
  //  IA
  // ================================
  async askAI(message: string): Promise<{ text: string }> {
    try {
      const prompt = `
Você é atendente da EV Volantes.

Seu objetivo:
- atender clientes
- vender volantes automotivos
- ser direto, profissional e simpático

Regras:
- sempre tente identificar o modelo do carro
- sempre incentive o cliente a continuar a conversa
- respostas curtas (máx 3 linhas)

Se o cliente demonstrar interesse de compra, finalize SUA RESPOSTA com:
LEAD_QUENTE

Pergunta do cliente:
${message}
`;

      const response = await axios.post(
        this.OPENAI_URL,
        {
          model: 'gpt-4o-mini', // custo baixo e rápido
          messages: [
            {
              role: 'system',
              content: prompt,
            },
          ],
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${this.OPENAI_API_KEY}`,
          },
        },
      );

      const text =
        response.data?.choices?.[0]?.message?.content ||
        'Desculpe, não consegui entender. Pode repetir?';

      return { text };

    } catch (error) {
      console.error('❌ erro IA:', error.message);

      return {
        text: 'Olá! Pode me dar mais detalhes do que você precisa?',
      };
    }
  }

  // ================================
  // 🔥 DETECÇÃO DE LEAD
  // ================================
  isHotLead(message: string, response: string) {
    const text = message.toLowerCase();

    return (
      response.includes('LEAD_QUENTE') ||
      text.includes('preço') ||
      text.includes('valor') ||
      text.includes('comprar') ||
      text.includes('tem disponível')
    );
  }

  // ================================
  // 🔔 NOTIFICAÇÃO
  // ================================
  async notifyOwner(phone: string, message: string) {
    console.log('🔥 LEAD QUENTE DETECTADO:', phone);

    // depois você pode:
    // - enviar WhatsApp pro dono
    // - mandar notificação no painel
    // - enviar email

    // exemplo simples:
    await this.sendWhatsToOwner(
      `🔥 Novo cliente interessado!\n\nTelefone: ${phone}\nMensagem: ${message}`
    );
  }

  async sendWhatsToOwner(text: string) {
    // integrar com Z-API aqui depois
    console.log('📲 Notificação dono:', text);
  }

  // ================================
  // 📲 RESPOSTA AO CLIENTE
  // ================================
  async replyToClient(phone: string, text: string) {
    console.log('📤 Respondendo cliente:', text);

    // integrar WhatsApp API aqui
  }

  // ================================
  // 💾 BANCO (mock inicial)
  // ================================
  async findOrCreateConversation(phone: string) {
    // depois troca por banco real

    return {
      id: 'conversation_' + phone,
      status: 'bot', // ou 'human'
    };
  }

  async saveMessage(conversationId: string, sender: string, text: string) {
    console.log('💾 salvando mensagem:', {
      conversationId,
      sender,
      text,
    });

    // salvar no banco aqui depois
  }
}