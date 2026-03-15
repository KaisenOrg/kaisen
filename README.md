# Kaisen

<div align="center">

<img src="./documents/assets/banner.png" width="100%" alt="Banner Kaisen">

</div>

<p align="center">
  <a href="#visão-geral-da-solução">Visão Geral da Solução</a> •
  <a href="#principais-funcionalidades">Principais Funcionalidades</a> •
  <a href="#tecnologias-utilizadas">Tecnologias Utilizadas</a> •
  <a href="#configuração-do-projeto">Configuração do Projeto</a> •
  <a href="#arquitetura-do-sistema">Arquitetura do Sistema</a> •
  <a href="#fluxos-da-aplicação">Fluxos da Aplicação</a> •
  <a href="#demonstração">Demonstração</a> •
  <a href="#estrutura-do-projeto">Estrutura do Projeto</a> •
  <a href="#próximos-passos">Próximos Passos</a> •
  <a href="#equipe-de-desenvolvimento">Equipe de Desenvolvimento</a>
</p>

> Este README fornece uma visão geral da plataforma Kaisen. Para informações mais detalhadas sobre a arquitetura e regras de negócio, consulte o nosso [wad.md](./documents/wad.md).

O Kaisen propõe um novo formato para a aquisição de conhecimento no Brasil. Somos uma plataforma educacional inteligente que substitui a lógica passiva de consumo de conteúdo por uma experiência ativa, guiada por inteligência artificial e impulsionada pela comunidade.

Através da combinação de IA generativa e curadoria coletiva, os usuários constroem trilhas de aprendizado personalizadas. O progresso individual é registrado de forma transparente e impulsionado por um sistema de gamificação, que engaja o usuário no desenvolvimento de habilidades específicas para o mercado de trabalho.

Mais do que apenas uma plataforma de cursos, o Kaisen lança as bases para uma infraestrutura de conhecimento escalável, focada em resolver o gap de qualificação técnica das empresas e profissionais brasileiros.

## Visão Geral da Solução

<div align="center">

<img src="./documents/assets/banner-home.png" width="100%" alt="Banner Home Kaisen">

</div>

O avanço da inteligência artificial transformou radicalmente o acesso à informação. Ferramentas como ChatGPT, YouTube e plataformas de cursos online estão capacitando uma nova geração de alunos autônomos. 

No entanto, essa revolução enfrenta uma limitação estrutural no mercado corporativo brasileiro: a falta de mecanismos ágeis para acompanhar e validar o aprendizado adquirido fora das instituições tradicionais.

O Kaisen nasceu para preencher essa lacuna. A plataforma atua como uma solução educacional que combina IA e curadoria para transformar jornadas individuais de estudo em um histórico de desenvolvimento contínuo. Cada trilha é construída com suporte de IA e validada pela comunidade, criando um portfólio de conhecimento que facilita a conexão com oportunidades de emprego.

## Principais Funcionalidades

<div align="center">

<img src="./documents/assets/feature-banner.png" width="100%" alt="Funcionalidades Kaisen">

</div>

### 1. Kai - Motor de Conteúdo com IA

O Kai é o núcleo inteligente da plataforma, projetado para transformar qualquer fonte de informação em uma experiência de aprendizado estruturada:

- **Chat Interativo e Contextual**: Atua como um tutor virtual. O usuário insere tópicos, links ou documentos (ex: PDFs) para iniciar uma jornada de aprendizado.
- **Geração Automatizada de Trilhas**: Constrói percursos personalizados com quizzes, flashcards, mapas mentais e resumos.
- **Edição Visual Modular**: Os usuários podem reorganizar e editar o conteúdo visualmente através de uma interface intuitiva de blocos/cards.

### 2. Ecossistema Colaborativo

O Kaisen é um ambiente vivo onde o conhecimento evolui através da inteligência coletiva:

- **Feed da Comunidade**: Explore trilhas de aprendizado publicadas, acompanhe tendências e interaja com outros estudantes.
- **Adaptação de Trilhas (Forking)**: Qualquer trilha pública pode ser duplicada e adaptada, permitindo que outros usuários aprimorem ou expandam o conteúdo para seus próprios contextos.
- **Fóruns Contextuais Integrados**: Discussões, feedbacks e debates são incorporados diretamente nos módulos de conteúdo.

### 3. Gamificação e Engajamento

Criamos um ambiente dinâmico que incentiva o aprendizado contínuo:

- **Histórico de Aprendizado**: A conclusão de uma trilha fica registrada no perfil do usuário, demonstrando sua evolução constante e domínio sobre os assuntos.
- **Reconhecimento Social**: O progresso e as trilhas concluídas podem ser compartilhados nativamente no LinkedIn e outras redes, destacando o engajamento do usuário.
- **Sistema de Pontuação e Recompensas**: Usuários que criam trilhas de alta qualidade e engajam a comunidade são recompensados e ganham destaque na plataforma.

### 4. Experiência do Usuário e Monitoramento

- **Perfil Universal do Usuário**: Um hub pessoal que agrega trilhas criadas e o histórico completo de aprendizado.
- **Dashboard para Criadores**: Métricas detalhadas sobre visualizações, adaptações (forks) e impacto de cada trilha criada.
- **Onboarding Guiado**: Um tutorial interativo que mostra passo a passo todo o potencial da plataforma para novos usuários.

## Tecnologias Utilizadas

### Frontend
- **React** – Biblioteca declarativa para construção de interfaces modulares.
- **Vite.js** – Ferramenta moderna de build com inicialização instantânea e carregamento rápido.
- **TypeScript** – Superset tipado do JavaScript para garantir previsibilidade e segurança no código.
- **Tailwind CSS** – Framework CSS utilitário para design rápido e responsivo.

### Backend & Banco de Dados
- **NestJS** – Framework Node.js progressivo para a construção de aplicações backend eficientes e escaláveis.
- **Prisma ORM** – Ferramenta moderna de mapeamento objeto-relacional (ORM) para comunicação segura e tipada com o banco.
- **PostgreSQL** – Banco de dados relacional robusto para armazenamento de perfis, trilhas e progresso dos usuários.

### Integrações e IA
- **Gemini API (Google)** – Integração com IA generativa para a criação de conteúdo educacional (resumos, quizzes, mapas mentais).

## Configuração do Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v20 ou superior)
- [PostgreSQL](https://www.postgresql.org/) rodando localmente ou via Docker
- Chave de API do [Google Gemini](https://ai.google.dev/)

---

### Guia de Instalação

1. **Clone o repositório:**
```bash
git clone [https://github.com/KaisenOrg/kaisen.git](https://github.com/KaisenOrg/kaisen.git)
cd kaisen

```

2. **Configuração do Backend:**

```bash
cd backend
npm install

```

* Crie um arquivo `.env` na raiz da pasta `backend` baseando-se no `.env.example`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/kaisen_db?schema=public"
GEMINI_API_KEY="sua_chave_aqui"

```


* Rode as migrations do banco de dados para criar as tabelas:

```bash
npx prisma migrate dev

```

* Inicie o servidor de desenvolvimento:

```bash
npm run start:dev

```

3. **Configuração do Frontend:**
Abra uma nova aba no terminal, volte para a raiz do projeto e acesse o frontend:

```bash
cd frontend
npm install

```

* Crie um arquivo `.env` (se necessário para variáveis públicas do Vite):
```env
VITE_API_URL="http://localhost:3000"

```


* Inicie a aplicação web:

```bash
npm run dev

```

**Pronto!** Acesso o frontend em `http://localhost:5173` e a API local estará respondendo em `http://localhost:3000`.

## Arquitetura do Sistema

O Kaisen utiliza uma arquitetura cliente-servidor moderna baseada em APIs RESTful. O frontend em React/Vite se comunica de forma segura com o backend em NestJS. Este backend centraliza as regras de negócio, a persistência de dados no PostgreSQL (através do Prisma ORM) e atua como intermediário seguro para a comunicação com a API do Gemini, responsável pelo processamento de linguagem natural e geração de material didático.

> Para informações mais detalhadas sobre os diagramas de arquitetura, consulte o [wad.md](https://www.google.com/search?q=./documents/wad.md).

## Fluxos da Aplicação

### Fluxo de Aprendizado Pessoal (Uso Privado)

1. O usuário acessa a plataforma e conclui o onboarding guiado.
2. Através do assistente Kai, ele envia um tópico, link ou PDF.
3. O backend processa a requisição via IA e gera uma trilha de aprendizado personalizada com quizzes, resumos e mapas mentais.
4. O usuário estuda o conteúdo em seu próprio ritmo.
5. Após a conclusão, a trilha é salva permanentemente em seu histórico de aprendizado no banco de dados relacional.

---

### Fluxo de Publicação na Comunidade (Contribuição Pública)

1. Após criar uma trilha de aprendizado, o usuário pode editar e refinar o conteúdo visualmente.
2. O Kai avalia o valor educacional da trilha e sugere sua publicação.
3. O usuário opta por publicar a trilha no feed da comunidade.
4. Outros usuários podem explorar, adaptar (fork) ou melhorar a trilha publicada.
5. O criador original ganha visibilidade, métricas de engajamento e reconhecimento no ecossistema.

## Demonstração

Acesse os materiais abaixo para uma visão completa do projeto (versões originais da concepção do projeto):

* 🎥 [Vídeo de Demonstração (Walkthrough inicial)](https://www.youtube.com/watch?v=6K1YQ5hfnrw)
* 🖼️ [Pitch Deck e Apresentação (Problema, Solução, Roadmap)](https://www.youtube.com/watch?v=rXXc-i82ziQ)

## Estrutura do Projeto

* **documents:** Contém todos os documentos do projeto, como o Web Application Document (WAD) e materiais complementares.
* **frontend:** Pasta contendo os arquivos da interface do usuário (React, Tailwind e Vite.js).
* **backend:** Pasta contendo a API do projeto (NestJS) e a modelagem do banco de dados (Prisma).
* **.gitignore:** Especifica para o Git quais arquivos ou pastas não devem ser versionados.
* **README.md:** Arquivo que serve como guia introdutório e explicação geral do projeto.

## Próximos Passos e Conclusões

O Kaisen está evoluindo para se consolidar como uma plataforma Web2 educacional robusta e escalável no mercado brasileiro.

Para os próximos passos, nossos principais objetivos incluem:

* Refatorar integrações antigas para a nova arquitetura NestJS + PostgreSQL.
* Continuar o desenvolvimento do construtor de trilhas, permitindo múltiplas seções multimídia.
* Implementar colaboração ativa dentro das trilhas (sistema de pull requests para conteúdo educacional).
* Expandir a inteligência do Kai para geração de métricas de performance do aluno.

## Equipe de Desenvolvimento

* [Giovanna Neves Rodrigues](https://github.com/GigicaNeves)
* [José Antônio Ferreira de Lima](https://github.com/jlimaz)
* [Marcus Felipe dos Santos Valente](http://github.com/m4rcusml)
* [Messias Fernandes de Olivindo](https://github.com/Messias-Olivindo)
* [Nicole Riedla Paiva Neves](https://github.com/nicriedla)

## Licença

Este projeto está licenciado sob os termos da [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).

Você é livre para usar, modificar e distribuir este software — inclusive para fins comerciais — desde que mantenha os avisos de direitos autorais e atribuições.

> Veja o arquivo [LICENSE](https://www.google.com/search?q=./LICENSE) para mais detalhes.

