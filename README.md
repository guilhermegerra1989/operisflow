## OperisFlow

Este é o projeto OperisFlow, contendo:

- API (NestJS)
- Web (Vite/Vue)
- Infraestrutura (Nginx + Podman Compose)

## Estrutura


## BD

- infra/db   (todas querys, inserts do banco ficam nessa pasta)

    # (remover volume)
    podman volume rm operisflow_operisflow_postgres_data 

    # (subir projeto novamente)