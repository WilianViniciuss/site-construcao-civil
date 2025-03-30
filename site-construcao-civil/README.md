# Site de Construção Civil

Site profissional para empresa de construção civil desenvolvido com Next.js e Tailwind CSS.

## Tecnologias Utilizadas

- Next.js 13
- TypeScript
- Tailwind CSS
- Supabase (Banco de dados e armazenamento de imagens)

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/site-construcao-civil.git
cd site-construcao-civil
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## Deploy

Este projeto está configurado para deploy automático na Vercel. Para fazer o deploy:

1. Crie uma conta na [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub à Vercel
3. Configure as variáveis de ambiente na Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. A Vercel fará o deploy automaticamente quando você fizer push para a branch principal

## Estrutura do Projeto

- `/app` - Páginas e componentes da aplicação
- `/components` - Componentes reutilizáveis
- `/public` - Arquivos estáticos
- `/styles` - Estilos globais

## Funcionalidades

- Página inicial com seção hero
- Galeria de projetos com carrossel de imagens
- Modal para visualização detalhada dos projetos
- Grid de imagens em tela cheia
- Seção "Sobre Nós" com estatísticas
- Botão de contato via WhatsApp
- Interface administrativa para gerenciar projetos e imagens

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 