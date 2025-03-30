# Site de Portfólio de Construção Civil

Este é um site profissional para exibição de trabalhos na área de construção civil, desenvolvido com Next.js, TypeScript e Supabase.

## Funcionalidades

- Exibição de projetos com imagens
- Animações suaves com Framer Motion
- Design responsivo
- Botão flutuante do WhatsApp
- Integração com Supabase para armazenamento de imagens e dados

## Pré-requisitos

- Node.js 18.x ou superior
- Conta no Supabase
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd site-construcao-civil
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env.local` na raiz do projeto
- Adicione suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Configure o banco de dados no Supabase:
- Crie uma tabela chamada `projetos` com os seguintes campos:
  - id (int, primary key)
  - titulo (text)
  - descricao (text)
  - imagem_url (text)
  - categoria (text)

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

6. Acesse o site em `http://localhost:3000`

## Estrutura do Projeto

```
site-construcao-civil/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .env.local
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- React Icons

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 