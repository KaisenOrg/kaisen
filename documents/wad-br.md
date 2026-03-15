<p align="center">
  <img src="assets/intro/header-intro.png" alt="header-top"><br>
</p>
<table align="center" style="border: none; border-collapse: collapse;">
  <tr>
    <td style="border: none;"><a href="https://www.linkedin.com/in/nicoleriedla/" target="_blank" rel="noopener noreferrer"><img src="assets/intro/nicole.png" alt="Nicole Riedla"></a></td>
    <td style="border: none; padding: 1;"><a href="https://www.linkedin.com/in/marcus-valente/" target="_blank" rel="noopener noreferrer"><img src="assets/intro/marcus.png" alt="Marcus Valente"></a></td>
    <td style="border: none; padding: 1;"><a href="https://www.linkedin.com/in/lima-j/" target="_blank" rel="noopener noreferrer"><img src="assets/intro/jose.png" alt="Jose Lima"></a></td>
    <td style="border: none; padding: 1;"><a href="https://www.linkedin.com/in/messias-olivindo/" target="_blank" rel="noopener noreferrer"><img src="assets/intro/messias.png" alt="Messias Olivindo"></a></td>
    <td style="border: none; padding: 1;"><a href="https://www.linkedin.com/in/giovanna-neves-rodrigues/" target="_blank" rel="noopener noreferrer"><img src="assets/intro/giovanna.png" alt="Giovanna Neves"></a></td>
  </tr>
</table>

<img src="assets/intro/header-bottom.png">

<a id="table-of-contents"></a>
## Índice

<details>
<summary><a href="#1-introduction">1. Introdução</a></summary>
</details>

<details>
<summary><a href="#2-application-overview">2. Visão geral do aplicativo</a></summary>
  <ul>
    <li>
<a href="#21-project-scope">2.1. Escopo do Projeto</a>
      <ul>
<li><a href="#211-porter-5-forces-model">2.1.1. Modelo das 5 Forças de Porter</a></li>
<li><a href="#212-swot-analysis-of-partner-institution">2.1.2. Análise SWOT da Instituição Parceira</a></li>
<li><a href="#213-solution">2.1.3. Solução</a></li>
<li><a href="#214-value-proposition-canvas">2.1.4. Tela de proposta de valor</a></li>
<li><a href="#216-business-model-canvas">2.1.5. Tela de modelo de negócios</a></li>
      </ul>
    </li>
<li><a href="#22-personas">2.2. Personagens</a></li>
  </ul>
</details>

<details>
<summary><a href="#3-application-project">3. Projeto de Aplicação</a></summary>
  <ul>
<li><a href="#31-architecture-diagram">3.1. Diagrama de Arquitetura</a></li>
<li><a href="#32-style-guide">3.2. Guia de estilo</a></li>
    <ul>
<li><a href="#321-colors">3.2.1. Cores</a></li>
<li><a href="#322-typography">3.2.2. Tipografia</a></li>
<li><a href="#323-iconography-and-images">3.2.3. Iconografia e Imagens</a></li>
    </ul>
<li><a href="#33-high-fidelity-prototype">3.3. Protótipo de alta fidelidade</a></li>
<li><a href="#34-data-modeling-on-chain">3.4. Modelagem de dados (on-chain)</a></li>
    <ul>
<li><a href="#341-smart-contracts-logic-on-chain">3.4.1. Lógica de contratos inteligentes (on-chain)</a></li>
    </ul>
  </ul>
</details>

<details>
<summary><a href="#4-application-development">4. Desenvolvimento de Aplicativos</a></summary>
  <ul>
<li><a href="#41-first-version-of-the-application-mvp">4.1. Primeira versão do aplicativo</a></li>
<li><a href="#42-second-version-of-the-application-mvp">4.2. Segunda versão do aplicativo</a></li>
  </ul>
</details>

<details>
<summary><a href="#5-market-study-and-marketing-plan">5. Estudo de Mercado e Plano de Marketing</a></summary>
  <ul>
<li><a href="#51-executive-summary">5.1. Resumo Executivo</a></li>
<li><a href="#52-market-analysis">5.2. Análise de Mercado</a></li>
<li><a href="#53-competitive-analysis">5.3. Análise Competitiva</a></li>
<li><a href="#54-target-audience">5.4. Público-alvo</a></li>
<li><a href="#55-positioning">5.5. Posicionamento</a></li>
<li><a href="#56-marketing-strategy">5.6. Estratégia de Marketing</a></li>
  </ul>
</details>

<details>
<summary><a href="#6-conclusions-and-future-work">6. Conclusões e trabalhos futuros</a></summary>
</details>

<details>
<summary><a href="#7-references">7. Referências</a></summary>
</details>

<details>
<summary><a href="#8-appendices">8. Apêndices</a></summary>
</details>

<a id="1-introduction"></a>
# 1. Introdução

Kaisen é uma plataforma educacional descentralizada que transforma a forma como as pessoas aprendem, coletam e validam conhecimento. Ao integrar inteligência artificial e tecnologia blockchain, o aplicativo oferece uma experiência inovadora e integrada, onde os usuários não apenas estudam de forma personalizada, mas também demonstram publicamente seu progresso por meio de certificações digitais imutáveis.

Na prática, o processo começa quando os usuários enviam conteúdos como PDFs, notas ou artigos diretamente para o Kai – assistente virtual inteligente da plataforma. A partir desse material, Kai gera flashcards interativos, questionários, resumos e roteiros de estudo personalizados, facilitando um aprendizado direcionado e eficiente. Ao concluir a jornada de estudos, o usuário pode validar os conhecimentos adquiridos por meio de um certificado NFT, que atesta de forma confiável e transparente o domínio do conteúdo do treinamento.

Além disso, Kaisen promove a partilha de conhecimento, onde os utilizadores, após completarem os seus percursos, podem disponibilizá-los publicamente com o conteúdo da formação, permitindo que outros beneficiem da jornada. Para enriquecer ainda mais este intercâmbio, os membros da comunidade podem contribuir com materiais suplementares para os trilhos existentes, enquanto o criador do trilho mantém a autonomia para aceitar todas, algumas ou nenhuma das contribuições. Isso promove a curadoria ativa e garante a qualidade dos recursos compartilhados.

A comunidade Kaisen desempenha um papel central na colaboração e no envolvimento. Se um usuário precisar de ajuda para desenvolver uma trilha, ele poderá compartilhar sua solicitação com a comunidade por meio de uma postagem com apenas um clique. Essas reclamações são postadas tanto na área do posto quanto diretamente na própria trilha, mas deixam claro que a trilha está aberta para melhorias. Quando uma contribuição é feita, o criador da trilha pode avaliá-la e decidir se a aceita.

O sistema de recompensa simbólica incentiva a participação ativa. Os usuários acumulam tokens interagindo de forma significativa, seja respondendo perguntas corretamente, completando trilhas, contribuindo com conteúdo, ajudando outros usuários ou interagindo com a comunidade com feedback e sugestões. Além disso, você pode ganhar tokens recomendando uma plataforma a amigos por meio de um código único: novos usuários inserem esse código no momento do cadastro, garantindo que quem desejar recebê-lo receberá uma recompensa. As postagens na conta interna da plataforma no Twitter também ganham tokens, incentivando a publicidade e a participação social.

Kaisen também valoriza a construção de confiança digital e conexões entre os usuários. Você pode acessar os perfis de outros membros, visualizar suas postagens, faixas selecionadas, faixas publicadas e contribuições para a comunidade. Clicar no nome de um usuário em qualquer postagem abre seu perfil, facilitando a visualização de seu histórico e o acompanhamento de seu trabalho.

Por fim, para tornar o aprendizado mais divertido e motivador, os tokens ganhos podem ser usados ​​na Kai Store – um ambiente interativo onde você pode desbloquear opções de mascotes com skins exclusivas, além de ferramentas especiais para aprimorar a experiência de aprendizado e criação de conteúdo.

Dessa forma, Kaisen se estabelece como um ambiente de aprendizagem inteligente, colaborativo e gratificante – onde cada conquista é registrada, cada contribuição é valorizada e o conhecimento é transformado em recompensas, reconhecimento e recompensas reais.

<a id="2-application-overview"></a>
# 2. Visão geral do aplicativo

<a id="21-project-scope"></a>
## 2.1. Escopo do Projeto

<a id="211-porters-5-forces-model"></a>
### 2.1.1. Modelo das 5 Forças de Porter

A indústria da educação enfrenta desafios crescentes, como a baixa qualidade do ensino e a dificuldade de comprovar a aprendizagem de forma confiável. Segundo a UNESCO, milhões de jovens ainda não têm acesso a uma educação adequada, enquanto o mercado de trabalho evolui rapidamente e exige um desenvolvimento profissional constante. Além disso, a falta de meios eficazes – digitais ou físicos – para validar o conhecimento dificulta o avanço de muitos indivíduos.

Neste contexto, Kaisen surge como uma solução inovadora ao combinar inteligência artificial e blockchain para personalizar a aprendizagem e garantir a validação segura do conhecimento através de certificados digitais imutáveis ​​(NFTs). Ao facilitar a aprendizagem, a certificação transparente e o compartilhamento colaborativo, Kaisen oferece uma alternativa eficaz às limitações do modelo educacional tradicional, ampliando o acesso e a confiança no processo educacional.

Nesse cenário, aplica-se a análise das Cinco Forças de Porter, ferramenta essencial para avaliar o ambiente competitivo e compreender os fatores que influenciam a dinâmica do setor.

<div align="center">

<sub>Figura 1 - Modelo das 5 Forças de Porter</sub>

<img src="assets/business/five-forces.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

**Rivalidade do Concorrente – Alta**<br>
O mercado de plataformas de educação online está em franca expansão, impulsionado por gigantes como Coursera, Udemy, Duolingo e Khan Academy, que alcançam milhões de usuários em todo o mundo. Esta diversidade de alternativas aumenta a competição por atenção e envolvimento. Para se diferenciar nesse cenário, a Kaisen adota uma proposta única: combina inteligência artificial personalizada com validação imutável de conhecimento via blockchain. Esta abordagem cria uma barreira qualitativa que reduz o impacto direto da concorrência tradicional e posiciona a plataforma como referência em inovação educacional.

**Ameaça de novos participantes – Moderada**<br>
A ameaça de novos participantes é moderada porque, apesar da facilidade de entrada no sector digital, o desenvolvimento de uma plataforma que integre IA, blockchain, gamificação e validação de conhecimento requer conhecimentos técnicos, investimento em infra-estruturas e credibilidade educacional. Estes requisitos criam barreiras tecnológicas e de confiança, dificultando a entrada de novos participantes com propostas semelhantes e protegendo a posição da plataforma Kaisen no mercado.

**Ameaça de produtos substitutos – Alta**<br>
A ameaça de produtos substitutos é elevada, pois os utilizadores podem optar por soluções informais, como vídeos do YouTube, e-books, fóruns ou podcasts gratuitos. Estas alternativas, embora acessíveis, carecem de estrutura pedagógica, certificação válida e mecanismos de engajamento. Para superar esse cenário, a plataforma Kaisen conta com uma jornada de aprendizagem personalizada baseada em inteligência artificial e na validação imutável do conhecimento por meio de NFTs – um diferencial significativo que não é facilmente replicável por substitutos tradicionais ou informais.

**Poder de barganha dos clientes – Alto**<br>
Dada a vasta gama de recursos educativos gratuitos ou de baixo custo disponíveis, os utilizadores têm um elevado nível de escolha e exigem um valor claro nas suas decisões. Para reduzir essa pressão, a Kaisen investe na experiência do usuário, oferecendo uma plataforma gamificada, transparente e focada na reputação digital por meio de NFTs certificados. Esta proposta de valor fortalece a fidelização, aumenta o engagement e transforma o utilizador num agente ativo no seu próprio desenvolvimento educativo.

**Poder de negociação do fornecedor – Moderado**<br>
A dependência de infraestruturas e ferramentas tecnológicas externas – como APIs de IA e redes blockchain – pode aumentar o poder de negociação dos fornecedores e impactar os custos operacionais. Para mitigar este risco, a Kaisen adota uma estratégia de descentralização de serviços, priorizando soluções escaláveis, interoperáveis ​​e que permitam flexibilidade na escolha de parceiros. Com isso, a plataforma garante autonomia técnica e maior resiliência diante das oscilações do mercado fornecedor.

<a id="212-swot-analysis-of-partner-institution"></a>
### 2.1.2. Análise SWOT da Instituição Parceira

A análise SWOT é uma ferramenta amplamente utilizada para planejar e mapear diversas soluções. Auxilia na compreensão de como uma empresa, marca, produto ou serviço se posiciona no mercado, identificando seus pontos fortes e fracos (fatores internos), bem como oportunidades e ameaças (fatores externos). Abaixo segue a análise da solução desenvolvida.

<div align="center">

<sub>Figura 2 - Modelo de Análise SWOT</sub>

<img src="assets/business/swot-analysis.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

**Fortes:**<br>

- Integração única de IA, gamificação e NFTs.
- Verdadeira personalização da aprendizagem através de um assistente inteligente.
- Validação de conhecimento descentralizada e transparente.
- Sistema de reputação digital.
- Comunidade ativa e colaborativa.
- Equipe multidisciplinar com forte visão tecnológica.

**Fraquezas:**<br>

- Recursos financeiros e técnicos limitados.
- Curva de adoção das tecnologias escolhidas (AI, NFT, Web3).
- Falta de tração inicial e validação de mercado.
- Risco de dependência de tecnologias de terceiros (por exemplo, redes blockchain, IA de terceiros).
- Ausência de apoio institucional ou certificação formalmente reconhecida.

**Oportunidades:**<br>

- Expansão da educação descentralizada.
- Crescimento de comunidades de aprendizagem entre pares.
- Aumentar o interesse na aprendizagem autodirigida.
- A educação como ativo reputacional (currículo público).
- Parcerias com plataformas e instituições inovadoras.

**Ameaças:**<br>

- Regulamentação incerta em relação ao uso de IA e blockchain.
- Plataformas educacionais estabelecidas.
- Desafios de adoção entre usuários não familiarizados com Web3.
- Saturação do mercado edtech (startups e plataformas voltadas para educação).
- Potencial desvalorização dos certificados NFT se não forem reconhecidos externamente.

A análise SWOT da plataforma Kaisen destaca um projeto com elevado potencial inovador, apoiado numa proposta de valor diferenciada que integra Inteligência Artificial, gamificação e validação descentralizada através de NFTs. Os seus principais pontos fortes residem na personalização da aprendizagem, no envolvimento da comunidade e na construção da reputação digital, todos alinhados com as tendências emergentes na educação e na Web3.

Contudo, o projeto enfrenta desafios relacionados à sua estrutura interna e ao atual nível de maturidade do mercado. A falta de tração inicial e validação de mercado, combinada com a curva de adoção das tecnologias envolvidas, apresenta obstáculos reais à expansão generalizada e à aceitação dos utilizadores. A disponibilidade limitada de recursos técnicos e financeiros, juntamente com a ausência de certificação institucional formalmente reconhecida, reforça a necessidade de uma estratégia sólida de entrada no mercado que priorize a facilidade de uso, testes com usuários reais e parcerias estratégicas.

As oportunidades externas são claras, especialmente com o valor crescente atribuído à aprendizagem autodirigida, à reputação digital e às comunidades colaborativas. No entanto, o projeto deve superar ameaças como a saturação do mercado edtech, o ceticismo em relação a tecnologias como os NFTs e o aumento da pressão regulatória sobre a IA e o blockchain.

Portanto, para garantir a sustentabilidade da solução, é essencial validá-la em nichos específicos, modularizar a sua complexidade tecnológica e desenvolver um plano de marketing que comunique claramente o seu valor único de forma acessível e focada no utilizador.

<a id="213-solution"></a>
### 2.1.3. Solução

**Problema a ser resolvido:** <br>
O modelo educacional tradicional é centralizado, caro e ineficiente no fornecimento de provas detalhadas e verificáveis ​​do conhecimento individual. Além disso, os certificados actualmente utilizados são frágeis e a aprendizagem é tratada como um produto e não como um ecossistema colaborativo. Consequentemente, faltam mecanismos eficazes para validar o conhecimento, bem como incentivos limitados para a partilha e colaboração dentro da comunidade.

**Dados disponíveis:** <br>
A plataforma oferece uma ampla variedade de conteúdos educacionais, disponíveis em diversos formatos, como PDFs, artigos, trabalhos de pesquisa e documentação técnica. Além disso, são coletados dados relevantes, como padrões e preferências de aprendizagem do usuário, métricas de envolvimento da comunidade e registros de validação baseados em blockchain. É importante destacar que a plataforma utiliza tanto conteúdo gerado pelo usuário quanto materiais de aprendizagem processados ​​por inteligência artificial (IA), criando assim um repositório de conhecimento abrangente e dinâmico.

**Solução proposta:** <br>
Kaisen é o primeiro protocolo de conhecimento descentralizado que transforma a aprendizagem – antes um processo de consumo passivo – em uma experiência criativa, colaborativa e valiosa. A solução combina caminhos de aprendizagem personalizados com tecnologias de IA e validação de blockchain, criando um verdadeiro “GitHub of Knowledge”.

Os usuários inserem matérias-primas (como PDFs, tópicos e links), que são processadas por Kai, um assistente de IA. A partir desse processamento, Kai gera trilhas de aprendizagem personalizadas. Se preferir, o usuário também pode criar sua trilha manualmente. Essas faixas podem ser publicadas, bifurcadas e melhoradas pela comunidade, resultando em um repositório vivo e em constante evolução, validado por certificados NFT e incentivado pela economia de tokens $KOIN.

**Como usar a solução:** <br>
- Entrada de Conteúdo: O usuário envia documentos ou define temas de interesse da Kai.
- Geração de caminhos: a IA, ou o próprio usuário, cria caminhos de aprendizagem personalizados que incluem questionários, flashcards e conteúdo interativo.
- Processo de aprendizagem: os usuários progridem nos caminhos com o apoio do tutor de IA.
- Colaboração da Comunidade: Após a conclusão, os caminhos podem ser publicados e melhorados pela comunidade através de bifurcação.
- Validação: A conclusão do processo de aprendizagem é certificada por NFTs “mineráveis”, servindo como prova de aprendizagem.
- Incentivo: os usuários são recompensados ​​com tokens $KOIN por criar conteúdo de qualidade, completar caminhos e colaborar com a comunidade.

**Benefícios esperados:** <br>
- Democratização do acesso à educação personalizada e baseada na IA.
- Credenciais de conhecimento verificáveis ​​e portáteis, protegidas por certificados blockchain.
- Criação de um ecossistema colaborativo de conhecimento, com conteúdos continuamente aprimorados pela comunidade.
- Estabelecimento de um modelo de incentivo sustentável que valorize o aprendizado e o compartilhamento.
- Redução dos custos educacionais e ampliação do acesso à educação.
- Fortalecer a reputação digital e o reconhecimento profissional através de conquistas certificadas.

**Critérios de sucesso e como será avaliado:** <br>
- Engajamento do usuário: medido pelo número de caminhos criados, concluídos e bifurcados mensalmente.
- Crescimento da Comunidade: Avaliado com base no número de usuários ativos e taxa de retenção (meta: mais de 5.000 usuários ativos no primeiro ano).
- Qualidade do conhecimento: verificada por meio de análises da comunidade e métricas de engajamento para faixas publicadas.
- Adoção de Certificações: Quantificada pelo número de certificados NFT emitidos e partilhados em contextos profissionais.
- Saúde da Economia Token: Monitorada com base na circulação do token $KOIN, adoção de mecanismos de staking e atividade de mercado.
- Impacto Educacional: Avaliado medindo melhorias no conhecimento e habilidades do usuário por meio de pré e pós-avaliações.

<a id="214-value-proposition-canvas"></a>
### 2.1.4. Tela de proposta de valor

O Value Proposition Canvas é uma ferramenta estratégica utilizada por diversas empresas com o objetivo de compreender profundamente as necessidades, dores e desejos de seus clientes, ao mesmo tempo em que visa criar e posicionar o produto ou serviço oferecido de acordo com essas demandas. Com base nisso, segue-se o Canvas de Proposta de Valor da solução Kaisen, que apresenta um perfil de cliente bem definido e uma descrição clara de como a solução proposta se alinha a ele.

<div align="center">

<sub>Figura 3 - Tela de proposta de valor</sub>

<img src="assets/business/canvas-value.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

**Trabalhos do cliente:**<br>

- Estude de forma autônoma utilizando conteúdos online.
- Criar e organizar seus próprios materiais de estudo (resumos, flashcards, roteiros de aprendizagem).
- Buscar materiais confiáveis ​​e relevantes alinhados aos seus objetivos.
- Validar oficialmente o conhecimento adquirido através de meios informais.
- Compartilhe conhecimento e materiais com outras pessoas.
- Visualize seu progresso e histórico de aprendizado de forma clara e personalizada.
- Avaliar e selecionar candidatos com base em jornadas de aprendizagem reais e comprovadas.

**Dores:**<br>

- Falta de conteúdo de estudo gratuito, organizado de forma lógica ou cronológica.
- Dificuldade em encontrar materiais objetivos e de alta qualidade.
- Ausência de uma visão clara e personalizada do progresso do estudo.
- Incapacidade de validar oficialmente a aprendizagem informal.
- Falta de centralização dos materiais de estudo nas diferentes áreas do conhecimento.
- Falta de incentivo para quem compartilha conhecimento com a comunidade.

**Ganhos:**<br>

- Criação de uma reputação digital de valor através de uma comunidade ativa.
- Geração de renda e reconhecimento através de conteúdos criados e trilhas de aprendizagem.
- Certificados digitais transparentes, confiáveis ​​e imutáveis ​​que validam o conhecimento.
- Um portfólio sólido e rastreável para utilização em processos seletivos.
- Motivação contínua através de gamificação e recompensas.
- Visão integrada e clara do histórico de aprendizagem de qualquer indivíduo.

**Produtos e Serviços:**<br>

- Plataforma educacional descentralizada integrando IA e blockchain.
- Assistente virtual inteligente (Kai) que transforma qualquer material em flashcards, resumos, quizzes e roteiros de estudo personalizados.
- Certificação digital via NFT com validação pública e imutável.
- Trilhas públicas de aprendizagem com possibilidades de colaboração e curadoria comunitária.
- Sistema de gamificação com recompensas em tokens e itens cosméticos.
- Loja interativa com customizações e ferramentas adicionais.
- Perfil educacional rastreável com reputação ligada ao progresso e à colaboração.

**Analgésicos:**<br>

- Organização automatizada e personalizada de estudos com base em materiais do próprio usuário.
- Validação oficial da aprendizagem informal sem dependência de instituições tradicionais.
- Visualização clara e contínua da evolução do conhecimento.
- Ferramentas para centralizar e documentar todo o percurso educativo.
- Incentivos tangíveis para quem contribui para a comunidade (recompensas e reputação).
- Transparência e rastreabilidade no registo de competências e aprendizagem.

**Ganhe criadores:**<br>

- Experiência de estudo mais eficiente, personalizada e motivadora apoiada pela IA.
- Recompensas por cada interação significativa: estudar, criar, contribuir.
- Possibilidade de rentabilizar o próprio conteúdo educativo.
- Reconhecimento da jornada educacional como um ativo de construção de reputação.
- Portfólio educacional compartilhável para recrutadores em formato objetivo e confiável.

A análise realizada por meio do Kaisen Value Proposition Canvas demonstra não apenas um entendimento claro das dores e expectativas do público-alvo, mas também um plano consistente para oferecer uma resposta funcional e estratégica a essas demandas. A proposta está ancorada em diferenciais tecnológicos, como a integração de IA, blockchain e certificações NFT. Contudo, o aspecto mais relevante da proposta reside na capacidade da plataforma de converter a aprendizagem informal em reputação verificável, característica ainda pouco explorada de forma consistente no mercado educacional.

Portanto, vale ressaltar que a solução aborda uma questão real e premente: a desconexão entre o conhecimento adquirido por meios não tradicionais e sua validação. A centralização dos dados de aprendizagem, a personalização do processo de estudo e a possibilidade de rentabilizar e partilhar jornadas educativas acrescentam valor direto ao utilizador final. Kaisen não depende apenas de tecnologias emergentes; constrói um ecossistema no qual o conhecimento é tratado como um ativo de reputação – rastreável, partilhável e, o mais importante, recompensável.

<a id="215-business-model-canvas"></a>
### 2.1.5 Tela do Modelo de Negócios

O Business Model Canvas (BMC) para Kaisen apresenta, de forma estruturada, os principais elementos que sustentam o modelo de negócios da plataforma. Ela organiza tudo, desde a proposta de valor — baseada na transformação de conteúdo disperso em trilhas de aprendizagem personalizadas e certificadas via blockchain — até segmentos de clientes, canais de relacionamento, fluxos de receita e estrutura de custos. Além de mapear essas áreas, o BMC será utilizado como ferramenta para analisar a viabilidade, consistência e potencial de crescimento da solução, orientando decisões estratégicas e melhorias contínuas.

<div align="center">

<sub>Figura 4 - Business Model Canvas</sub>

<img src="assets/business/business-model-canvas.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

<a id="1-value-proposition"></a>
#### 1. Proposta de valor

Kaisen transforma conteúdo disperso — como PDFs, links e tópicos — em trilhas de aprendizagem personalizadas geradas por inteligência artificial, aprimoradas pela comunidade e certificadas via blockchain. O processo de aprendizagem muda de passivo para ativo, colaborativo e rastreável, com um histórico educacional confiável.

Os usuários gratuitos podem explorar e adaptar faixas públicas existentes. Os assinantes premium desbloqueiam a criação completa com tecnologia de IA, acesso a faixas exclusivas, certificados NFT personalizáveis ​​e recursos avançados de personalização e gamificação.

**A plataforma permite:**
- Transformação de conteúdo bruto em trilhas interativas e personalizadas com IA.
- Compartilhamento comunitário e remixagem de faixas, com curadoria social e validação descentralizada.
- Certificação imutável do progresso através de NFTs educacionais, criando um portfólio verificável.
- Acesso gratuito para descobrir e adaptar faixas públicas.
- Recursos premium para criação avançada, personalização e validação aprofundada.
- Um sistema futuro de recompensas e curadoria baseado no token $KOIN.


<a id="2-customer-segments"></a>
#### 2. Segmentos de clientes

Kaisen atende diversos perfis ligados à educação descentralizada, validação informal de conhecimento e curadoria de trilhas técnicas.

**Os principais segmentos incluem:**
- Autodidatas e criadores técnicos que procuram validar e rentabilizar os seus conhecimentos e criações.
- Estudantes de áreas desfavorecidas com elevado envolvimento digital e acesso limitado à educação formal.
- Profissionais de RH que necessitam de provas concretas e verificáveis ​​de competências, além dos diplomas tradicionais.
- Plataformas educacionais que buscam integrar certificações blockchain confiáveis ​​e interoperáveis.
- Comunidades Web3, DAOs e projetos educacionais descentralizados focados em curadoria e validação distribuída.


<a id="3-channels"></a>
#### 3. Canais

Kaisen se conecta com seus usuários por meio de vários canais digitais e comunitários, integrando aquisição, entrega de valor e envolvimento contínuo.

**Canais de aquisição:**
- Redes sociais estratégicas: X (Twitter), Instagram, YouTube, LinkedIn.
- Parcerias com criadores de conteúdo e influenciadores do ecossistema educacional.
- Participação em hackathons, eventos de inovação, comunidades técnicas e Web3.
- Divulgação orgânica por meio de conteúdo educacional, NFTs como prova de aprendizagem e materiais interativos.

**Canais de entrega:**
- Plataforma web responsiva acessível em desktop e mobile.
- Login via identidade descentralizada (por exemplo, Identidade da Internet ou carteiras digitais).
- Elementos de navegação e gamificação assistidos por IA integrados na interface.

**Canais de engajamento:**
- Servidores Discord e fóruns da comunidade para suporte e interação entre pares.
- DAOs educacionais e redes Web3 para curadoria coletiva e desenvolvimento de trilhas.
- Reputação interna, distintivo e sistema de classificação para incentivar a contribuição contínua.


<a id="4-customer-relationships"></a>
#### 4. Relacionamento com o cliente

O relacionamento da Kaisen com os usuários é impulsionado por uma jornada assistida e gamificada, guiada por feedback constante, com diferentes abordagens para usuários finais, criadores e stakeholders corporativos.

**Para usuários finais:**
- Integração interativa de IA apresentando os principais recursos da plataforma (faixas, certificados, assistente Kai).
- Recompensas iniciais por ações como publicação, bifurcação e compartilhamento de certificados.
- Feedback em tempo real por meio de questionários, conquistas e acompanhamento de progresso.

**Para criadores de conteúdo:**
- Dashboard com métricas de engajamento das faixas publicadas.
- Recompensas simbólicas e visibilidade dentro da comunidade.
- Participação em futuras tomadas de decisão através de sistema de sugestões e votação (futura governança $KOIN).


<a id="5-revenue-streams"></a>
#### 5. Fluxos de receita

A estratégia de monetização da Kaisen é híbrida, combinando SaaS, transações de mercado e economia gamificada.

**Assinatura Premium (Kaisen Pro):**
- Criação completa de pistas com tecnologia de IA.
- Certificados NFT personalizáveis.
- Acesso a faixas privadas e exclusivas.
- Personalização do perfil.
- Descontos na Loja Kai.
- Uso ilimitado do assistente Kai.

**Loja Kai:**
- Venda de itens digitais personalizados (avatares, efeitos visuais, crachás).
- Receita direta de vendas e potencial uso futuro do token $KOIN.


<a id="6-key-resources"></a>
#### 6. Recursos principais

Kaisen depende de uma combinação de uma arquitetura tecnológica robusta, uma equipe estratégica e uma base comunitária ativa.

**Infraestrutura tecnológica:**
- IA para geração e personalização de trilhas.
- Sistema de emissão e verificação de NFT em blockchain.
- Plataforma web responsiva com interface gamificada e acessível.

**Equipe:**
- Desenvolvimento full-stack (front-end, IA, Web3).
- Design de produto e experiência do usuário.
- Comunidade e gerenciamento de conteúdo.

**Ativos intangíveis:**
- Marca posicionada como referência em reputação educacional descentralizada.
- Comunidade engajada de criadores, curadores e primeiros usuários.
- Reputação distribuída e mecanismo de validação de rastreamento.


<a id="7-key-activities"></a>
#### 7. Atividades principais

Kaisen realiza atividades estratégicas que visam a inovação contínua da plataforma, validação de conhecimento e envolvimento da comunidade.

**Desenvolvimento e manutenção:**
- Evolução da plataforma e do assistente Kai.
- Atualizações da infraestrutura de IA e integração do protocolo blockchain.
- Garantir segurança, estabilidade e usabilidade.

**Curadoria e validação:**
- Monitoramento da qualidade da trilha e moderação de conteúdo.
- Validação de certificados NFT emitidos.
- Manutenção do sistema descentralizado de curadoria social e reputação.

**Engajamento e crescimento:**
- Gestão ativa da comunidade (Discord, fóruns, eventos).
- Incentivar a criação e bifurcação de pistas com incentivos e recompensas simbólicas.
- Parcerias com DAOs, edtechs, criadores e empresas para crescimento orgânico.


<a id="8-key-partnerships"></a>
#### 8. Parcerias-chave

Kaisen conta com uma rede estratégica de parceiros para infraestrutura, conteúdo, validação e expansão de impacto.

**Tecnologia e validação:**
- Provedores de blockchain para emissão educacional de NFT (por exemplo, ICP).
- APIs e protocolos para interoperabilidade educacional (crachás abertos, carteiras descentralizadas).

**Conteúdo e distribuição:**
- Plataformas educacionais e criadores de conteúdo técnico.
- Comunidades Web3, DAOs e projetos focados em curadoria e educação descentralizadas.
- Universidades, hackathons e centros de inovação.

**Inclusão e impacto:**
- Especialistas em reconhecimento de conhecimentos informais e microcertificações.
- ONG e iniciativas que promovem a inclusão digital para jovens desfavorecidos e educação técnica acessível.


<a id="9-cost-structure"></a>
#### 9. Estrutura de custos

A estrutura de custos da Kaisen foi desenhada com base em um cenário de MVP funcional, com tecnologia pronta para produção e adoção inicial moderada. O ciclo projetado de 12 meses inclui:
- 500 a 1.000 usuários ativos/mês com uso recorrente.
- Geração de rastreamento, upload de conteúdo, emissão de certificado NFT.
- 3 GB de armazenamento em canisters, com execução média de 300 bilhões de ciclos/mês.
- Uma equipe pequena e altamente qualificada focada em desenvolvimento, IA, design e Web3.

**Composição da equipe:**
6 profissionais estratégicos e 1 função de suporte freelance:
- 1 Desenvolvedor Full-Stack (integrações front-end, back-end, IA e blockchain)
- 1 especialista em IA (meio período)
- 1 Designer de Produto (UX/UI)
- 1 Gerente de Produto (consultor parcial)
- 1 engenheiro Web3
- 1 Gerente de Comunidade
- 1 Suporte Técnico Autônomo

**Custos mensais estimados por categoria:**
- **Equipe de desenvolvimento e técnica:** R$ 22 mil – R$ 33 mil
- **Infraestrutura (Internet Computador + ferramentas auxiliares):** R$ 16.500 – R$ 25.300
- **Comunidade e suporte:** R$ 5.500 – R$ 8.500
- **Marketing e aquisição:** R$ 3.000 – R$ 8.000
- **Incentivos e gamificação:** R$ 1.500 – R$ 4.500

**Custo mensal total:** R$ 48.500 – R$ 79.300
**Custo anual estimado:** R$ 582 mil – R$ 951,6 mil


Kaisen se posiciona como uma plataforma inovadora no cenário educacional descentralizado, combinando inteligência artificial, curadoria comunitária e certificação blockchain para transformar conteúdo disperso em jornadas de aprendizagem personalizadas e verificáveis. Sua proposta de valor combina acessibilidade, com um modelo freemium robusto e profundidade, oferecendo aos usuários Premium recursos avançados de criação, personalização e validação de habilidades.

O modelo de negócios foi pensado para atender diversos perfis, desde autodidatas e estudantes carentes até empresas e comunidades Web3, conectando-se com o público por meio de múltiplos canais digitais e comunitários. A experiência do usuário é pautada por um relacionamento gamificado e assistido que estimula a participação ativa e o crescimento contínuo.

O modelo de monetização híbrido — combinando assinaturas SaaS, mercado e economia gamificada — garante a diversificação das receitas, enquanto os principais recursos e atividades refletem um equilíbrio entre tecnologia de ponta, design de experiência e envolvimento da comunidade. Parcerias estratégicas ampliam o alcance e a relevância da solução, fortalecendo seu ecossistema e credibilidade.

Com esta base sólida, Kaisen tem potencial para se tornar uma referência global em reputação educacional descentralizada, combinando tecnologia, comunidade e reconhecimento de conhecimento para democratizar e valorizar a aprendizagem em todas as suas formas.


<a id="22-personas"></a>
## 2.2. Personagens

Representando indivíduos específicos, as personas são perfis semifictícios construídos com base em dados reais e observações sobre o público-alvo. Sua principal função é facilitar o entendimento das necessidades, comportamentos e motivações dos usuários, permitindo o desenvolvimento de soluções mais direcionadas e eficazes.

Abaixo estão três personas desenvolvidas especificamente para este projeto para orientar a tomada de decisões e garantir maior alinhamento com as expectativas do usuário final.

<div align="center">

<sub>Figura 5 - Persona 1</sub>

<img src="assets/business/persona-clara.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

Ela representa uma jovem estudante ambiciosa de uma comunidade periférica que vê a tecnologia como um caminho para novas oportunidades. Aluna do ensino médio técnico cursando Ciência da Computação na periferia de São Paulo, ela personifica o aprendiz autodidata, utilizando a tecnologia móvel como aliada em sua jornada educacional. A personalidade de Clara destaca a importância da aprendizagem acessível e personalizada, capaz de transformar o estudo informal em credenciais reconhecidas – um desafio fundamental para estudantes que procuram demonstrar as suas competências para além dos ambientes académicos tradicionais.

<div align="center">

<sub>Figura 6 - Persona 2</sub>

<img src="assets/business/persona-daniel.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

Ele personifica o desenvolvedor autodidata moderno que se destaca no ecossistema Web3. Aos 23 anos, esse desenvolvedor júnior representa uma comunidade crescente de profissionais que aprimoraram suas habilidades por meio de caminhos de aprendizagem alternativos, como tutoriais no YouTube, contribuições para projetos de código aberto e participação em hackathons. Sua persona destaca a lacuna entre o conhecimento prático e o reconhecimento formal, ao mesmo tempo que simboliza a economia criativa, na qual os produtores de conteúdo educacional buscam gerar impacto e monetizar seu conhecimento.

<div align="center">

<sub>Figura 7 - Persona 3</sub>

<img src="assets/business/persona-renata.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

Ela representa o profissional de RH progressista que trabalha em um cenário de talentos em constante mudança, especialmente em startups de tecnologia. Como analista de RH com formação em Psicologia, ela enfrenta o desafio diário de avaliar candidatos cujas competências mais relevantes foram muitas vezes adquiridas através de percursos de aprendizagem não tradicionais. A sua personalidade destaca o dilema do recrutador moderno: como reconhecer e validar de forma justa a aprendizagem informal e, ao mesmo tempo, desenvolver processos de seleção mais inclusivos e baseados em evidências, capazes de identificar talentos para além das credenciais educacionais formais.

<a id="3-application-project"></a>
# 3. Projeto de aplicação

<a id="31-architecture-diagram"></a>
## 3.1. Diagrama de Arquitetura

O diagrama de arquitetura da aplicação, conforme ilustrado na imagem, foi projetado com uma separação clara entre as camadas front-end, autenticação, back-end e integração externa. Essa estrutura modular visa garantir não apenas a organização e facilidade de manutenção do código, mas também segurança, escalabilidade e uma experiência de usuário de alto desempenho. O diagrama é, portanto, uma ferramenta essencial para visualizar a organização dos componentes, facilitando o entendimento entre os desenvolvedores e orientando as decisões técnicas ao longo do projeto.

<div align="center">

<sub>Figura 8 - Diagrama de arquitetura</sub>

<img src="./assets/simple-architecture.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

O front-end representa a camada de interação direta com o cliente, construída com um conjunto de tecnologias modernas para garantir uma interface eficiente. A base da interface é desenvolvida em React, que permite a criação de componentes de UI dinâmicos e reutilizáveis. O processo de desenvolvimento é acelerado pelo Vite, uma ferramenta de construção de alta velocidade. Para garantir a robustez e qualidade do código, o projeto adota TypeScript, que adiciona digitação estática ao JavaScript, enquanto o estilo é gerenciado pelo Tailwind CSS, um framework utilitário que permite a construção de designs customizados de forma ágil e consistente.

A ponte entre a interface do usuário e os serviços back-end é a camada de autenticação, que adota uma abordagem de identidade digital soberana por meio da Identidade da Internet e do NFID. Ao contrário dos sistemas tradicionais baseados em nome de usuário e senha, este método permite que os usuários acessem a aplicação com segurança usando criptografia e dispositivos com suporte WebAuthn. Isso fortalece a segurança, a privacidade e a experiência do usuário, eliminando a necessidade de memorizar senhas.

O núcleo lógico do aplicativo reside no back-end, que é implementado por meio de Canisters hospedados no blockchain do Internet Computer (ICP). Essa escolha descentraliza a aplicação, tornando-a mais segura, transparente e resistente a falhas ou censura. Dentro dessa estrutura, diversos canisters operam de forma orquestrada para entregar as funcionalidades da plataforma. O users_backend gerencia perfis e dados de usuários; otracks_backend serve como repositório central para as trilhas de aprendizagem; o chats_backend permite funcionalidades de comunicação e comunidade; e o nft_certificates, em comunicação direta com otracks_backend, é responsável por gerar e emitir certificados de conclusão em formato NFT, garantindo sua autenticidade e imutabilidade.

Para aprimorar a aplicação com inteligência artificial avançada, a arquitetura integra um serviço externo de última geração. A orquestração dessa integração é feita pelo kai_backend, um canister específico que atua como intermediário. Ele recebe as matérias-primas fornecidas pelo usuário (como PDFs e links) e aciona o modelo de linguagem Gemini, do Google, por meio de chamadas seguras de API. O Gemini então processa esses dados para gerar trilhas de aprendizagem personalizadas. Esta abordagem híbrida combina o poder computacional de um LLM em grande escala com a segurança e a descentralização da lógica de negócios executada em cadeia, otimizando o melhor dos dois mundos.
 
Este diagrama é essencial para visualizar a organização dos componentes, facilitando o entendimento entre desenvolvedores e stakeholders e orientando as decisões técnicas ao longo do desenvolvimento.

<a id="32-style-guide"></a>
## 3.2. Guia de estilo

O guia de estilo Kaisen visa garantir consistência visual e funcional em toda a interface da plataforma. Serve como referência central para designers e desenvolvedores, padronizando o uso de cores, tipografia e elementos gráficos. Ao fortalecer a identidade visual de Kaisen, o guia reduz inconsistências no desenvolvimento de interfaces e garante acessibilidade, coerência estética e escalabilidade em diferentes módulos de aplicação – sejam eles voltados para aprendizagem individual, validação comunitária ou apresentação pública do conhecimento adquirido.

<a id="321-colors"></a>
### 3.2.1. Cores

A paleta de cores é um elemento essencial na construção visual da plataforma Kaisen, contribuindo para a comunicação clara do propósito da aplicação, reforçando os seus valores de autonomia, inovação e descentralização. As cores foram escolhidas com base em princípios de contraste, acessibilidade e hierarquia visual, garantindo uma experiência intuitiva, funcional e acolhedora para diferentes perfis de usuários.

<div align="center">

<sub>Figura 9 - Cores</sub>

<img src="assets/design/colors.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

A cor principal da identidade visual é um tom vibrante de laranja (#F97316 | orange-500), que evoca energia, criatividade e transformação – aspectos centrais da proposta educacional de Kaisen. Essa cor é aplicada a elementos interativos proeminentes, como botões principais, frases de chamariz e marcadores de progresso. Sua variação mais intensa, laranja escuro (#C2410C | laranja-700), é utilizada em contextos onde se deseja maior ênfase ou profundidade visual, mantendo a consistência e o dinamismo na comunicação.

A paleta também inclui tons de cinza cuidadosamente distribuídos, variando do branco (#FAFAFA | zinc-50) ao preto (#09090B | zinc-950). Esses tons neutros proporcionam equilíbrio à interface, permitindo que os elementos laranja se destaquem claramente, garantindo ao mesmo tempo legibilidade e acessibilidade em todos os dispositivos e modos de visualização (como o modo escuro).

Cada cor da paleta serve a um propósito estratégico – seja como plano de fundo, contorno, sombra ou texto – reforçando a identidade Kaisen e promovendo uma navegação consistente e simplificada, focada no aprendizado contínuo.

<a id="322-typography"></a>
### 3.2.2. Tipografia

A tipografia utilizada na plataforma Kaisen foi selecionada com base na legibilidade, simplicidade e consistência visual, visando proporcionar uma leitura fluida e acessível em diferentes dispositivos e contextos. A fonte Poppins, disponível no Google Fonts, foi escolhida por seu design clean, moderno e altamente legível.

<div align="center">

<sub>Figura 10 - Tipografia</sub>

<img src="assets/design/typography.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

O uso de uma única fonte em toda a interface contribui para a uniformidade do design, enquanto variações de tamanho, peso e espaçamento permitem a criação de uma hierarquia visual bem definida. Títulos e call to action utilizam pesos mais ousados, como SemiBold, em tamanhos maiores (32px e 24px), para destacar informações relevantes e orientar a navegação do usuário. O corpo do texto, como descrições e instruções, utiliza gramaturas Regular ou Média, com tamanhos que variam de 14px a 16px e espaçamento consistente de -2%, promovendo uma leitura confortável e fluida.

Ao adotar estrategicamente a fonte Poppins e suas variações, Kaisen reforça sua identidade visual e proporciona uma experiência consistente, acolhedora e inclusiva para toda a sua comunidade de aprendizagem descentralizada.


<a id="323-visual-elements"></a>
### 3.2.3. Elementos Visuais

Os elementos visuais da plataforma Kaisen foram concebidos para comunicar, simbólica e emocionalmente, os valores fundamentais da solução. Entre esses elementos destacam-se o mascote e o logotipo, que reforçam a identidade da plataforma e promovem uma ligação mais próxima com os usuários.

<div align="center">

<sub>Figura 11 - Mascote</sub>

<img src="assets/design/mascot.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

O mascote da plataforma, Kai, é uma raposa expressiva e acolhedora, apresentada em diversas variações que representam diferentes estados emocionais e momentos da jornada de aprendizagem – como estudar, relaxar, ouvir música ou se movimentar. A escolha deste animal evoca atributos como inteligência, curiosidade e despreocupação, refletindo a visão da plataforma de tornar a aprendizagem descentralizada mais humana, envolvente e acessível. A presença da mascote contribui para fortalecer a ligação emocional com os utilizadores, tornando a experiência mais envolvente e cativante.

<div align="center">

<sub>Figura 12 - Logotipo</sub>

<img src="assets/design/logo.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

O logotipo Kaisen, por sua vez, é composto por formas geométricas modulares organizadas em torno de um bloco central – um símbolo fundamental da identidade visual da plataforma. Este bloco central carrega um duplo significado: representa tanto os blocos que estruturam a tecnologia blockchain quanto os blocos de conhecimento construídos ao longo do processo de aprendizagem. Não é uma forma sólida tradicional, como um quadrado ou retângulo; em vez disso, é composto de diversas partes que se conectam e evoluem.

Esta composição fragmentada simboliza a natureza colaborativa e em constante evolução do Kaisen, onde os usuários e a inteligência artificial trabalham juntos para organizar, validar e expandir o conhecimento. O logotipo transmite assim os pilares fundamentais da proposta da plataforma: descentralização, autonomia, tecnologia e coautoria.

Juntos, o mascote Kai e o logotipo formam uma identidade visual forte e simbólica que é consistente com os princípios do Kaisen – uma plataforma que combina tecnologia de ponta com empatia e propósito, transformando a forma como as pessoas aprendem e compartilham conhecimento.

<a id="33-high-fidelity-prototype"></a>
## 3.3. Protótipo de alta fidelidade

Um protótipo de alta fidelidade fornece uma representação visual detalhada do aplicativo. Simula o formato dos campos do design, as interações e a experiência do usuário, utilizando cores, tipografia, ícones, botões e outros elementos gráficos compatíveis com o produto final.

Este tipo de protótipo permite validar decisões de design antes do início do desenvolvimento, testar a usabilidade com usuários reais e apresentar uma solução visual e funcionalmente aos interessados.

O protótipo completo pode ser acessado através da plataforma Figma, através do seguinte link: [Figma Prototype](https://www.figma.com/design/qPsCtf4GvgwH6cmUgdy7Q8/Kaisen--WCHL-?node-id=11-55&p=f&t=iUgnCTERVnBrP4BJ-0)

Abaixo estão as telas prototipadas, que ilustram as principais funcionalidades do aplicativo:

<div align="center">

<sub>Figura 13 - Home</sub>

<img src="./assets/screens/1.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

A tela inicial serve como ponto central de navegação da plataforma, oferecendo aos usuários uma visão panorâmica de seu progresso e acesso rápido aos principais recursos. Sendo o primeiro contacto do utilizador com a aplicação, desempenha um papel crucial na definição da experiência do utilizador, dando o tom visual e funcional da viagem. Ele exibe caminhos de aprendizagem destacados e estatísticas personalizadas, facilitando a descoberta intuitiva de conteúdos relevantes.

<div align="center">

<sub>Figura 14 - Bate-papo</sub>

<img src="./assets/screens/2.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

Essa interface permite a comunicação direta com o assistente de inteligência artificial da plataforma, Kai. Por meio desse canal, os usuários podem enviar materiais, tirar dúvidas e receber orientações educacionais personalizadas. Esta funcionalidade representa o núcleo da proposta de valor da Kaisen, pois transforma conteúdo bruto em experiências de aprendizagem estruturadas, dinâmicas e interativas, alimentadas por IA.

<div align="center">

<sub>Figura 15 - Trilhas</sub>

<img src="./assets/screens/3.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

A tela de trilhas é o ambiente central de descoberta de conteúdo, onde todo o material da plataforma é organizado e categorizado por áreas de conhecimento. Para facilitar a busca, a interface oferece recursos de filtragem por temas, interesses e níveis de dificuldade, permitindo ao usuário encontrar facilmente as trilhas mais adequadas aos seus objetivos educacionais. Além disso, a plataforma incentiva a construção coletiva: os usuários que desejam melhorar uma trilha podem iniciar sua colaboração através do botão “Colaborar”.

<div align="center">

<sub>Figura 16 - Trilhas</sub>

<img src="./assets/screens/4.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

Os modais fornecem uma visão geral detalhada de um caminho de aprendizagem específico, incluindo sua descrição, progresso do usuário, módulos disponíveis, conteúdo relacionado e recursos suplementares. São componentes essenciais para o engajamento do usuário, pois permitem acesso direto a diversos tipos de recursos educacionais, como flashcards, resumos, questionários e vídeos. Assim, proporcionam uma experiência de aprendizagem mais dinâmica, interativa e estruturada, favorecendo a assimilação personalizada e eficiente do conhecimento.

<div align="center">

<sub>Figura 17 - Prática e Prova de Aprendizagem</sub>

<img src="./assets/screens/5.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

Na seção Prática, os usuários têm acesso a recursos que os auxiliam na revisão do conteúdo estudado ao longo do caminho, incluindo quizzes e testes interativos. Esses recursos são essenciais para consolidar o aprendizado e validar o progresso individual. Ao concluir as atividades propostas, o usuário desbloqueia a seção Prova de Aprendizagem, onde poderá obter seu certificado em formato NFT. Este certificado é autenticado via blockchain, garantindo sua autenticidade e imutabilidade. A plataforma também oferece opções de compartilhamento direto nas redes sociais, aumentando a visibilidade das conquistas dos usuários e fortalecendo sua reputação digital.

<div align="center">

<sub>Figura 18 - Descubra</sub>

<img src="./assets/screens/6.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

O recurso Descobrir tem como objetivo ampliar as possibilidades de aprendizagem, facilitando a exploração de novos caminhos e conteúdos por meio de categorias temáticas, filtros inteligentes e recomendações personalizadas. Essa tela é vital para manter o envolvimento contínuo dos usuários e estimular a curiosidade, conectando-os a conhecimentos que de outra forma poderiam passar despercebidos.

<div align="center">

<sub>Figura 19 - Perfil</sub>

<img src="./assets/screens/7.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

A tela de perfil é um painel centralizado que consolida todas as informações, atividades e contribuições do usuário na plataforma Kaizen, oferecendo uma visão abrangente de sua jornada e interação social. Apresenta informações de identificação, como foto, nome e nome de usuário, além de biografia pessoal, links para redes sociais e métricas de seguidores e perfis seguidos. A interface também inclui botões de ação para seguir ou enviar mensagens e uma seção de emblemas que destaca conquistas especiais como ‘PRO’ e ‘OG’.

O conteúdo principal é organizado em abas, onde a aba “Visão Geral” exibe as colaborações do usuário, como as trilhas de aprendizagem que ele criou, e um feed de atividades recentes com trilhas concluídas e interações sociais. Na aba “Comunidade”, o usuário pode acessar todas as suas publicações e acompanhar o engajamento por meio de curtidas, comentários e repostagens.

<div align="center">

<sub>Figura 20 - Loja do Kai</sub>

<img src="./assets/screens/8.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

A loja de Kai é uma interface gamificada onde os usuários podem usar tokens de plataforma ($KOIN) para adquirir personalizações visuais, skins, recursos exclusivos e ferramentas premium. Este é um recurso estratégico tanto para monetização quanto para retenção de usuários, oferecendo incentivos tangíveis para envolvimento contínuo. Ao possibilitar experiências personalizadas, a loja também ajuda a fortalecer o vínculo emocional dos usuários com a plataforma.

<div align="center">

<sub>Figura 21 - configurações e comunidade</sub>

<img src="./assets/screens/9.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

A tela de configurações permite que os usuários ajustem suas preferências de uso, configurem notificações e gerenciem suas contas de forma personalizada. Esse recurso oferece maior controle sobre a experiência individual dentro da plataforma, promovendo conforto, acessibilidade e segurança durante o uso contínuo.

A tela da comunidade tem como objetivo fortalecer as interações entre os usuários, servindo como espaço de troca e colaboração. Aqui, os participantes podem postar sobre suas experiências na plataforma, compartilhar reflexões sobre o processo de aprendizagem, divulgar caminhos criados e interagir com conteúdos de outros membros. Essa dinâmica contribui para a construção de uma rede de apoio e engajamento educativo, incentivando o reconhecimento mútuo e o desenvolvimento coletivo.

<div align="center">

<sub>Figura 22 - criar trilhas</sub>

<img src="./assets/screens/10.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

O processo de criação de uma nova trilha (trilha) de aprendizagem é um fluxo de trabalho intuitivo e flexível, permitindo ao usuário construir conteúdo manualmente ou com auxílio de Inteligência Artificial. O fluxo começa com um modal onde o usuário define as informações básicas da faixa, como título e descrição. Em seguida, avançam para uma tela de seleção de objetivos, “O que você quer aprender?”, que orienta a geração de conteúdo pela IA ou prepara o caminho para a construção manual. Ao optar pela criação manual, o usuário acessa um editor visual e interativo estilo canvas, onde pode estruturar a trilha de forma dinâmica adicionando e conectando diferentes seções de conteúdo como resumos, flashcards, quizzes, vídeos e perguntas. Além disso, antes de prosseguir, é necessário preencher um formulário de “Informações do Curso” para adicionar metadados e outros detalhes.

<div align="center">

<sub>Figura 23 - criar seções</sub>

<img src="./assets/screens/11.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

Dentro do editor de trilhas, a plataforma oferece um conjunto de modais específicos para a criação de diversos tipos de seções de conteúdo. Cada modal é projetado para ser intuitivo e focado em tarefas, permitindo ao usuário construir uma experiência de aprendizagem rica e interativa.

Para a criação dos Resumos, o usuário utiliza um editor de texto completo (editor de rich text). A interface permite a inserção de título e a formatação do corpo do texto com diversas opções, como negrito, itálico, sublinhado, listas numeradas ou com marcadores, e a inserção de links, garantindo a criação de um material de leitura bem estruturado e organizado.

A seção Flashcards é ideal para exercícios de memorização. O usuário pode definir um título para o conjunto e depois criar cartões individualmente, preenchendo os campos “Frente” (para a pergunta ou termo) e “Voltar” (para a resposta ou definição). A interface oferece a flexibilidade de adicionar quantos flashcards forem necessários ao conjunto por meio do botão "+ Adicionar novo cartão".

Na criação de Quizzes, o usuário pode elaborar uma pergunta objetiva e configurar múltiplas opções de resposta. Para cada opção existe um seletor que permite marcar qual é a correta, tornando a avaliação automatizada e interativa. É possível adicionar mais perguntas de acordo com a necessidade do usuário.

Além disso, é possível incorporar conteúdo audiovisual através da seção Vídeo. Basta o usuário inserir a URL do vídeo desejado, adicionar um título e uma descrição para contextualizar o material. A plataforma exibe uma prévia do vídeo, garantindo que o link foi incorporado corretamente antes da criação da seção.

<div align="center">

<sub>Figura 24 - ferramentas de colaboração</sub>

<img src="./assets/screens/12.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

Na tela de colaboração é possível reorganizar a ordem das seções através de um sistema de arrastar e soltar, editar o conteúdo das seções existentes através de editores específicos (como o editor de rich text para resumos) ou adicionar novas seções de conteúdo. Todas as ferramentas de criação à disposição do autor original também são disponibilizadas ao colaborador, garantindo que suas contribuições sejam ricas e bem formatadas.

Depois que um colaborador envia as alterações, o autor original da faixa é notificado. Na aba “Colaboração”, eles encontram um painel de gerenciamento com um histórico detalhado de todas as contribuições pendentes. Para cada proposta são exibidas informações cruciais: o que foi modificado, quem fez a alteração e a data de envio. O autor então tem o poder de revisar cada alteração e decidir se aceita a colaboração, integrando-a permanentemente na trilha, ou rejeita-a. Este sistema de aprovação garante a qualidade e integridade do conteúdo original, ao mesmo tempo que estimula a melhoria contínua através da inteligência coletiva da comunidade.

<a id="4-application-development"></a>
# 4. Desenvolvimento de aplicativos

<a id="41-first-version-of-the-application"></a>
## 4.1. Primeira versão do aplicativo

Foi concluída a primeira versão do MVP da aplicação Kaisen, fornecendo a estrutura essencial do sistema, com foco na validação dos principais fluxos de utilização e integrações entre backend e frontend. Essa entrega inicial priorizou a experiência do usuário, autenticação, recursos básicos de interação e integração com a camada blockchain.

<a id="structure-and-implemented-features"></a>
#### Estrutura e recursos implementados

Nesta versão inicial foram entregues os seguintes componentes funcionais:

- **Página inicial com menu de navegação:** Interface clara, com acesso rápido às principais áreas do sistema.
- **Gerenciamento de perfil de usuário:** Criação, visualização e edição de perfis, incluindo apelidos, biografias e funções.
- **Painel da comunidade:** Tela para visualização de postagens da comunidade, promovendo interação e engajamento entre os usuários.
- **Gerenciamento e exibição de trilhas de usuários:** Veja trilhas criadas, em andamento e concluídas para cada perfil.

<a id="technical-development-process"></a>
#### Processo de Desenvolvimento Técnico

O desenvolvimento combinou tecnologias modernas, com uma divisão clara entre o frontend React/Vite (TypeScript) e o backend Motoko. Hooks e provedores foram criados para autenticação, gerenciamento de usuários e integração de operações com canisters Motoko. O sistema de chat AI usa solicitações assíncronas, histórico contextual e persistência de interação.

<a id="screen-illustrations"></a>
#### Ilustrações de tela
Algumas das principais telas implementadas nesta versão são:

<div align="center">

<sub>Figura 25 - Home</sub>

<img src="./assets/screens-aplication/home.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

<div align="center">

<sub>Figura 26 - Trilhas</sub>

<img src="./assets/screens-aplication/tracks.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

<div align="center">

<sub>Figura 27 - Descobrir</sub>

<img src="./assets/screens-aplication/discover.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

<a id="challenges-faced"></a>
#### Desafios enfrentados

Entre os principais desafios estavam a integração segura entre o frontend e os canisters Motoko, a modelagem do fluxo de autenticação descentralizada e a gestão do status da conversa com IA, garantindo atualizações em tempo real da interface e consistência dos dados do usuário.

Esta versão MVP valida os pilares essenciais da plataforma Kaisen, servindo como uma base sólida para a evolução contínua e a inclusão de novas funcionalidades nas próximas etapas do projeto.

<a id="42-second-version-of-the-application"></a>
## 4.2 Segunda versão do aplicativo

A segunda versão da plataforma Kaizen representa uma evolução significativa, focada em melhorar a experiência do usuário e expandir as principais funcionalidades do ecossistema de aprendizagem. O principal objetivo era solidificar a infraestrutura técnica com o desenvolvimento de um back-end robusto e, ao mesmo tempo, introduzir novos recursos para aumentar o engajamento, a interatividade e a validação das conquistas dos usuários por meio de tecnologias inovadoras como os NFTs.

Para garantir uma implementação coesa e alinhada aos objetivos de usabilidade, todo o desenvolvimento seguiu um protótipo de alta fidelidade. Isso permitiu a programação de novas telas e a reestruturação precisa das interfaces existentes, resultando em um produto final mais polido, intuitivo e funcional, preparado para suportar novas interações da comunidade e solidificar o modelo de aprendizagem da plataforma.

<a id="structure-and-implemented-features"></a>
#### Estrutura e recursos implementados
Nesta nova versão foram entregues os seguintes componentes funcionais, transformando a plataforma em um ecossistema de aprendizagem mais completo e colaborativo:

- **Gerenciamento de certificados NFT:** Implementação do fluxo completo de geração, visualização e gerenciamento de certificados NFT, validando as conquistas dos usuários no blockchain.
- **Sistema de Autenticação de Usuário:** Implementação de login, logout e gerenciamento de identidade, integrando com o backend da Motoko.
- **AI Chat (Kai):** Funcionalidade de chat inteligente, permitindo aos usuários iniciar conversas com IA, salvar histórico e respostas dinâmicas.
- **Fluxo de criação de trilhas:** Ferramentas avançadas para os usuários criarem trilhas de aprendizagem complexas, com suporte para vários tipos de conteúdo, como resumos, questionários, flashcards e vídeos.
- **Sistema de Colaboração da Comunidade:** Uma nova área que permite aos usuários sugerir edições e melhorias em faixas existentes, com sistema de aprovação do autor original.
- **Perfil de usuário aprimorado:** Reestruturação da tela de perfil para incluir métricas de engajamento, faixas publicadas, certificados e atividades recentes.
- **Verificação externa de NFT:** Uma página pública que permite a qualquer pessoa verificar a autenticidade de um certificado NFT por meio de um código exclusivo.

<a id="technical-development-process"></a>
#### Processo de Desenvolvimento Técnico

O desenvolvimento foi orientado por um protótipo de alta fidelidade, garantindo coesão entre design e implementação. No back-end, foram criados serviços robustos para geração e gerenciamento de NFTs, além da implementação de endpoints para suporte à criação de trilhas (operações CRUD), do sistema “Koins”, do chat dinâmico e do acompanhamento do progresso do usuário. No front-end, a equipe implementou as novas interfaces, como o perfil aprimorado, o fluxo completo de criação de conteúdo e os modais de colaboração, além de ajustar o gerenciamento de identidades com suporte ao “DevAuth”.

<a id="screen-illustrations"></a>
#### Ilustrações de tela
Algumas das principais telas e fluxos implementados nesta versão são:

<div align="center">

<sub>Figura 28 - Seção de adição de trilha</sub>

<img src="./assets/screens-aplication/track-add-section.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

<div align="center">

<sub>Figura 29 - NFT premiado</sub>

<img src="./assets/screens-aplication/nft-awarded.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

<div align="center">

<sub>Figura 30 - Bate-papo</sub>

<img src="./assets/screens-aplication/chat.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

<div align="center">

<sub>Figura 31 - Visão geral do perfil</sub>

<img src="./assets/screens-aplication/profile-overview.png" width="100%">

<sup>Fonte: Material produzido pelos autores (2025)</sup>

</div>

<a id="challenges-faced"></a>
#### Desafios enfrentados

Entre os principais desafios estavam a integração do back-end com a tecnologia blockchain para geração e verificação de NFTs, a implementação de um sistema de colaboração que gerenciasse diferentes versões e aprovações de conteúdo e o desenvolvimento do back-end de chat para suportar interações dinâmicas e em tempo real. No front-end, o desafio era traduzir os fluxos complexos do protótipo em componentes interativos e responsivos.

Esta segunda versão do Kaisen solidifica a plataforma como um ecossistema de aprendizagem robusto e interativo. Os novos recursos para criação, colaboração e certificação via NFT não apenas enriquecem a experiência do usuário, mas também estabelecem uma base técnica avançada para a implementação futura de gamificação, personalização e outros recursos inovadores.

<a id="5-market-study-and-marketing-plan"></a>
# 5. Estudo de Mercado e Plano de Marketing

A pesquisa de mercado e o plano de marketing da Kaisen visam alinhar a proposta da plataforma às reais necessidades do público, no contexto da educação digital descentralizada. Compreender o comportamento de aprendizagem e o cenário competitivo permite o posicionamento estratégico da solução, enquanto o plano de marketing orienta sua comunicação e promoção, com foco no engajamento e consolidação da marca.

<a id="51-executive-summary"></a>
## 5.1. Sumário executivo

Kaisen é uma plataforma educacional descentralizada que integra inteligência artificial e blockchain para personalizar o aprendizado e certificar o conhecimento por meio de NFTs, garantindo autenticidade e portabilidade. Num contexto marcado pelo crescimento da aprendizagem informal e pela falta de validação confiável, Kaisen conecta autonomia, reconhecimento e colaboração, transformando a aprendizagem em uma experiência gamificada e acessível.

Suas características distintivas incluem a organização automática de caminhos personalizados alimentados por IA, certificação digital imutável, uma economia simbólica para recompensas e incentivo à cocriação comunitária. A plataforma oferece uma alternativa inovadora às soluções educacionais tradicionais, democratizando o acesso à reputação digital baseada em conhecimento real.

Seus objetivos estratégicos incluem: (i) personalizar a aprendizagem com base no conteúdo do usuário; (ii) promover a certificação pública e segura; (iii) estimular a curadoria colaborativa; e (iv) transformar a aprendizagem numa jornada gratificante e significativa.

<a id="52-market-analysis"></a>
## 5.2. Análise de Mercado

<a id="521-industry-overview"></a>
### 5.2.1. Visão geral da indústria

O mercado global de EdTech está a crescer rapidamente, impulsionado pela digitalização e pela procura de aprendizagem autónoma, e deverá ultrapassar os 400 mil milhões de dólares até 2025, de acordo com a HolonIQ. No Brasil, a expansão das certificações, da aprendizagem autodirigida e da gamificação é uma tendência consolidada.

A integração da IA ​​com blockchain representa uma inovação promissora, permitindo uma personalização eficaz e uma certificação segura. Embora ainda emergente, espera-se que este modelo cresça, especialmente em áreas com elevada procura de reconhecimento informal, como tecnologia, design e educação continuada.

<a id="522-market-size-and-growth"></a>
### 5.2.2. Tamanho e crescimento do mercado

O mercado brasileiro de educação online gerou receita de R$ 1,8 bilhão em 2023, com expectativa de crescimento médio anual de 16% até 2027, segundo a ABED. Espera-se que plataformas que combinem autonomia, gamificação e validação de conhecimento ganhem força em meio à insatisfação com modelos rígidos e à busca por formas mais acessíveis e significativas de aprender.

Além disso, espera-se que o mercado educacional de NFT cresça à medida que aumenta a adoção de credenciais digitais descentralizadas. A IBM e a OCDE apontam que os certificados digitais verificáveis ​​são uma das principais tendências na validação de competências.

<a id="523-market-trends"></a>
### 5.2.3. Tendências de mercado

As tendências que impactam diretamente o mercado Kaisen incluem: a validação da aprendizagem informal, o fortalecimento da reputação digital e de portfólios verificáveis, o avanço de plataformas descentralizadas e autogeridas, a valorização de certificações com aplicação profissional, a personalização do ensino por meio de IA e a gamificação como estratégia de engajamento.

<a id="53-competitive-analysis"></a>
## 5.3. Análise Competitiva

**Principais Concorrentes:**<br>
Kaisen se posiciona contra diversos concorrentes. Os concorrentes diretos incluem plataformas como Coursera, Udemy e edX, focadas na educação formal online; Duolingo, com seu modelo de aprendizagem gamificado; e plataformas voltadas para tecnologia e mercado criativo, como Platzi, Alura e Rocketseat. Os concorrentes indiretos incluem plataformas como YouTube, Reddit, Notion e ferramentas como GPTs, Obsidian e Google Keep, que, embora não sejam plataformas de aprendizagem estruturadas, são amplamente utilizadas na aprendizagem autodirigida e na construção de conhecimento pessoal.

**Vantagens Competitivas do Aplicativo Web:**<br>
A principal vantagem competitiva da Kaisen é seu modelo de certificação integrado via NFTs – imutáveis, verificáveis ​​e compartilháveis ​​– combinado com IA que estrutura trilhas personalizadas com base no conteúdo do próprio usuário. Além disso, a economia de tokens como forma de recompensa, a curadoria da comunidade e o foco na reputação digital, mais do que apenas na entrega de conteúdo, solidificam sua diferenciação de mercado.

<a id="54-target-audience"></a>
## 5.4. Público-alvo

O público-alvo da plataforma Kaisen são principalmente jovens com idades entre 16 e 35 anos, incluindo estudantes, desenvolvedores e freelancers. Este grupo valoriza a autonomia no processo de aprendizagem, procura o reconhecimento formal das competências adquiridas informalmente e está interessado em métodos de aprendizagem inovadores. Psicograficamente, esses indivíduos desejam flexibilidade, autonomia e validação de suas habilidades. Comportamentalmente, estão familiarizados com tecnologias como IA, Web3 e plataformas digitais colaborativas, o que os torna naturalmente receptivos à abordagem Kaisen.

<a id="55-positioning"></a>
## 5.5. Posicionamento

A proposta de valor da Kaisen ? ser a primeira plataforma educacional descentralizada que permite aos usu?rios criar trilhas de aprendizagem personalizadas impulsionadas por intelig?ncia artificial, validar seus conhecimentos por meio de NFTs e compartilhar sua reputa??o digital de forma p?blica, segura e transparente. A estratégia de diferenciação centra-se na inversão do modelo tradicional: em vez de depender de conteúdos pré-formatados, Kaisen organiza e potencia o conhecimento já adquirido pelo utilizador, transformando esse conteúdo numa viagem significativa com a ajuda da IA. O sistema de certificação NFT e a curadoria coletiva garantem autenticidade, colaboração e uma reputação verificável para os usuários.

<a id="56-marketing-strategy"></a>
## 5.6. Estratégia de Marketing

**Produto:**<br>
Kaisen é uma plataforma web educacional gamificada que integra inteligência artificial, blockchain e NFTs. Seu principal diferencial está na capacidade de criar trilhas de aprendizagem personalizadas com base nos conteúdos e interesses do usuário, transformando o conhecimento em uma jornada interativa e significativa. Além disso, a plataforma emite certificados digitais em formato NFT, oferecendo prova de aprendizagem imutável. Para fortalecer o engajamento, existe uma loja de recompensas com itens como skins e ferramentas que podem ser adquiridos por meio da economia simbólica. Outro componente essencial é a presença de uma comunidade ativa e de coautoria, que contribui para a curadoria dos caminhos, valida conteúdos e promove uma experiência de aprendizagem colaborativa.

**Preço:**<br>
A plataforma adota um modelo de negócios freemium, oferecendo acesso gratuito aos recursos básicos do Kaisen. Recursos avançados como personalizações, caminhos premium, documentos privados, limites de upload mais altos e acesso a recursos avançados de IA (“Kaisen Pro”) são desbloqueados por meio do token da plataforma, $KOIN. A certificação NFT é gratuita para usuários que concluírem as trilhas, criando um ecossistema que valoriza o mérito e o envolvimento do usuário sem criar barreiras financeiras ao aprendizado.

**Local:**<br>
A distribuição da plataforma será estratégica, com lançamento inicial em comunidades digitais e hubs de inovação com foco em tecnologia e educação. Kaisen também buscará parcerias com bootcamps, hackathons, escolas técnicas e iniciativas relacionadas ao universo Web3. A presença em eventos de tecnologia e educação – tanto online quanto presenciais – será essencial para promover a plataforma, estabelecer conexões com educadores e desenvolvedores e atrair usuários inovadores dispostos a experimentar novos métodos de aprendizagem.

**Promoção:**<br>
A promoção de Kaisen se concentrará no marketing de conteúdo e no envolvimento da comunidade. Serão produzidos artigos, vídeos e posts sobre temas como reputação digital, validação de competências, inteligência artificial e novas formas de aprender de forma independente. A marca estará presente em redes como Twitter, Telegram e Discord, onde as conversas sobre Web3 e tecnologia educacional são mais ativas. Além disso, a plataforma fará parceria com influenciadores do mundo da tecnologia e da educação, que poderão compartilhar suas experiências com a Kaisen e aumentar a credibilidade da marca. Campanhas de storytelling com histórias reais de usuários – mostrando como Kaisen impactou seu aprendizado ou trajetória profissional – fortalecerão a conexão emocional com o público e destacarão o valor transformador da proposta.

<a id="6-conclusions-and-future-work"></a>
# 6. Conclusões e trabalhos futuros

Kaisen estabeleceu-se como uma plataforma inovadora para aprender e construir coletivamente caminhos de conhecimento num ambiente descentralizado. Combinando arquitetura moderna, integração blockchain e foco na experiência do usuário, o projeto permite que as pessoas explorem e compartilhem conhecimento de forma aberta, segura e gamificada.

Com os avanços alcançados até o momento, Kaisen já oferece recursos essenciais como organização modular de conteúdo, chat assistido, perfis de usuário e acompanhamento de progresso. Porém, a equipe reconhece o potencial de expansão e melhoria da plataforma, visando metas ambiciosas para versões futuras.

Entre os principais focos de desenvolvimento futuro está a implementação de um sistema de recompensas tokenizadas, no qual os usuários serão recompensados ​​por realizar ações relevantes na plataforma – como seguir trilhas, completar etapas, contribuir com conteúdo e interagir socialmente. Este mecanismo de incentivo visa não só aumentar o envolvimento, mas também valorizar a colaboração e a participação activa da comunidade.

Além disso, está a ser planeado um sistema de governação descentralizado, permitindo aos utilizadores participar nas decisões estratégicas e evolutivas da Kaisen. Através de mecanismos que permitem à comunidade influenciar diretamente os rumos da plataforma, fortalecendo o sentimento de pertença e autonomia coletiva.

Outro avanço planejado é a introdução da funcionalidade de bifurcação de caminho – um mecanismo inspirado em práticas de desenvolvimento de código aberto. Com esse recurso, os usuários poderão criar uma cópia pessoal (fork) de qualquer caminho de aprendizagem público e adaptar livremente sua estrutura, conteúdo e fluxo para atender aos seus objetivos individuais de aprendizagem ou estilos preferidos. Isto abre possibilidades para uma personalização e experimentação mais profundas, capacitando os alunos a construir jornadas verdadeiramente personalizadas. Uma vez modificado, os usuários terão a opção de enviar sua versão bifurcada para revisão ou reintegrá-la ao caminho original, promovendo um ecossistema dinâmico de refinamento colaborativo. Isto não só incentiva a diversidade e a cocriação de conhecimento, mas também ajuda a identificar e elevar as experiências de aprendizagem mais eficazes para a comunidade como um todo.

Esses avanços, aliados à busca constante por melhorias em usabilidade, acessibilidade, internacionalização e integração com novos protocolos, abrem caminho para que Kaisen se torne referência em educação descentralizada, colaborativa e voltada para o futuro. O compromisso permanece com a construção de um ambiente aberto, democrático e cada vez mais significativo para todos os seus usuários.

<a id="7-references"></a>
# 7. Referências

IBM. Relatório Blockchain na Educação. 2023. Disponível em: https://www.ibm.com/downloads/cas/6YVBDQKL. Acesso em: 03 de julho de 2025.

HOLONIQ. Global EdTech Market Outlook 2024. 2024. Disponível em: https://www.holoniq.com/edtech. Acesso em: 03 de julho de 2025.

DATACAMP. IA na Educação: Desafios de Integridade e Validação. 2024. Disponível em: https://www.datacamp.com/pt/blog/ai-in-education. Acesso em: 03 de julho de 2025.

REVISTA FT. Inteligência Artificial na Educação: Impactos e Desafios. 2024. Disponível em: https://revistaft.com.br/inteligencia-artificial-na-educacao-impactos-e-desafios/. Acesso em: 03 de julho de 2025.

RNP – REDE NACIONAL DE EDUCAÇÃO E PESQUISA. Inteligência artificial na educação: avanços e desafios. 2024. Disponível em: https://www.rnp.br/blog/inteligencia-artificial-na-educacao-avancos-e-desafios/. Acesso em: 04 de julho de 2025.

FRONTEIRAS NA EDUCAÇÃO. Limitações na avaliação e validação formal dos resultados da aprendizagem utilizando ferramentas de IA. Frontiers in Education, 2024. Disponível em: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1501819/full. Acesso em: 04 de julho de 2025.

GONZÁLEZ, R.; MORALES, F. Como a IA impacta a validação do conhecimento. Pré-impressão arXiv, 2024. Disponível em: https://arxiv.org/pdf/2504.06928. Acesso em: 04 de julho de 2025.

SMITH, L.; JONES, A. A lacuna de credibilidade no conteúdo educacional gerado por IA. Pré-impressão arXiv, 2024. Disponível em: https://arxiv.org/pdf/2406.18900. Acesso em: 04 de julho de 2025.

TECNOLOGIA. 8 principais cursos de certificação de blockchain a serem seguidos. TechTarget, 2023. Disponível em: https://www.techtarget.com/whatis/feature/8-top-blockchain-certification-courses-to-pursue. Acesso em: 04 de julho de 2025.
