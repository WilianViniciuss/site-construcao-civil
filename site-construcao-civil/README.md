# Site de Portfólio de Construção Civil

Este é um site profissional desenvolvido com Next.js para mostrar trabalhos de construção civil.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase

## Pré-requisitos

- Node.js 18.17 ou superior
- Conta no Supabase

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/site-construcao-civil.git
cd site-construcao-civil
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Configure o Supabase:
   - Crie uma tabela `projetos` com os seguintes campos:
     - id (int, primary key)
     - titulo (text)
     - descricao (text)
     - imagem_url (text)
     - categoria (text)
   - Configure o bucket de armazenamento para as imagens
   - Configure as políticas de segurança

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse o site em `http://localhost:3001`

## Estrutura do Projeto

```
site-construcao-civil/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── .env.local
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Funcionalidades

- Exibição de projetos em grid responsivo
- Animações suaves com Framer Motion
- Botão de WhatsApp flutuante
- Design responsivo com Tailwind CSS
- Integração com Supabase para armazenamento de dados e imagens

## Personalização

1. Para alterar o número do WhatsApp:
   - Edite o arquivo `app/layout.tsx`
   - Procure pelo link do WhatsApp e altere o número no formato: `5511999999999`

2. Para alterar as cores:
   - Edite o arquivo `app/globals.css`
   - Modifique as variáveis CSS na seção `:root`

3. Para adicionar mais projetos:
   - Acesse o painel do Supabase
   - Adicione novos registros na tabela `projetos`
   - Faça upload das imagens no bucket de armazenamento

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 