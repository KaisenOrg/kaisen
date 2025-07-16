import Time "mo:base/Time";

module {
    /**
     * @notice Um bloco de texto simples, como um parágrafo.
     */
    public type TextBlock = {
      value: Text;
    };

    /**
     * @notice Representa uma imagem, com uma URL e uma legenda opcional.
     */
    public type ImageBlock = {
      url: Text;
      caption: ?Text;
    };

    /**
     * @notice Representa uma seção de vídeo com um título, uma URL e uma descrição.
     */
    public type VideoBlock = {
      url: Text;
      caption: Text;
    };

    /**
     * @notice Um elemento de uma página pode ser um bloco de texto ou uma imagem.
     */
    public type PageElement = {
      #Text : TextBlock;
      #Image : ImageBlock;
      #Video: VideoBlock;
    };

    /**
     * @notice Representa uma seção do tipo de texto, com um título e uma lista de elementos que podem ser textos ou imagens.
     */
    public type Page = {
      title: Text;
      elements: [PageElement];
    };

    /**
     * @notice Representa uma seção de flashcards simples com frente e verso.
     */
    public type Flashcard = {
      sentence: Text;
      answer: Text;
    };

    /**
     * @notice Representa uma única alternativa em um quiz.
     */
    public type Alternative = {
      id: Nat;
      text: Text;
    };

    /**
     * @notice Representa uma seção de quiz com uma pergunta, uma lista de alternativas e a referência da resposta correta.
     */
    public type Quiz = {
      question: Text;
      alternatives: [Alternative];
      correctAnswerId: Nat;
    };

    /**
     * @notice Representa uma seção de uma questão dissertativa com uma resposta esperada.
     */
    public type EssayQuestion = {
      question: Text;
      expectedAnswer: Text;
    };
    
    /**
     * @notice Um tipo que pode conter qualquer um dos tipos de conteúdo definidos acima.
     * Cada seção da trilha terá um 'Content'.
     */
    public type Content = {
      #Page : Page;
      #Flashcard : [Flashcard];
      #Quiz : [Quiz];
      #Essay : [EssayQuestion];
    };

    /**
     * @notice Define uma única seção dentro de uma trilha de aprendizado.
     */
    public type Section = {
      id: Nat;
      title: Text;
      content: Content;
    };

    /**
     * @notice Define o formato de uma trilha de aprendizado.
     */
    public type Track = {
      id: Text;
      title: Text;
      description: Text;
      authorId: Text;
      createdAt: Time.Time;
      sections: [Section];
    };
};