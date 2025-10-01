// Base de dados de comentários interativos
const COMMENTS = {
    objective: {
        'trabalho': 'Ótimo! Os EUA buscam talentos em diversas áreas. Seu perfil pode ser ideal para vistos de trabalho como o EB1, EB2 (EB2 NIW).',
        'estudo': 'As universidades americanas são de nível mundial. O visto de estudante (F-1) pode ser um caminho para oportunidades futuras no país.',
        'investimento': 'Esse é um dos caminhos mais diretos para um Green Card! Os vistos de investidor (E2, EB-5) podem ser a sua porta de entrada.',
        'familia': 'A base de toda imigração é a família. Este é um processo prioritário para o governo americano.',
        'turismo': 'Uma ótima forma de conhecer o país e suas oportunidades! O visto de turista (B1/B2) é o primeiro passo.',
        'outro': 'Entendido. Sua jornada é única, e estamos prontos para traçar o mapa ideal para você.'
    },
    capital: {
        'menos-20k': 'Não se preocupe, existem diversas opções para quem não possui alto capital. Vamos explorar todas elas!',
        '20k-500k': 'Esse capital pode ser um diferencial para vistos de empreendedorismo ou para dar suporte ao processo.',
        '500k-1m': 'Excelente! Você se enquadra na faixa de investimento para o visto EB-5 em determinadas áreas. Isso é uma vantagem enorme.',
        'mais-1m': 'Isso abre as portas para todas as oportunidades de visto de investidor (EB-5), inclusive em centros regionais de alta demanda.'
    },
    maritalStatus: {
        'solteiro': 'O processo para solteiros costuma ser mais simples e rápido. Ótimo!',
        'casado': 'É uma jornada para toda a família! Quando você obtém o visto de imigrante, seu cônjuge também se qualifica.',
        'divorciado': 'Sem problemas! Seu estado civil não impacta negativamente no processo de imigração.',
        'viuvo': 'Entendemos sua situação. Há caminhos específicos para viúvos, especialmente se o cônjuge era cidadão americano.',
        'separado': 'Tudo bem! Isso não afeta suas chances de imigração para os EUA.',
        'uniao-estavel': 'É uma jornada para toda a família! Quando você obtém o visto de imigrante, seu companheiro(a) também pode se qualificar.'
    },
    hasChildren: {
        'sim': 'Ótimo! Filhos menores de 21 anos podem ser incluídos no seu processo de imigração.',
        'nao': 'Perfeito! Isso pode acelerar alguns processos de imigração.'
    },
    citizenship: {
        'sim': 'Isso pode acelerar ou até abrir novos caminhos! Algumas nacionalidades têm acordos especiais com os EUA.',
        'nao': 'Não há problema! A cidadania brasileira já é um ótimo ponto de partida para a maioria dos processos.'
    },
    education: {
        'ensino-medio': 'Perfeito! Vamos focar em outras áreas do seu perfil, como experiência profissional e vínculos familiares, para encontrar o visto ideal.',
        'graduacao': 'Ótimo! Sua formação acadêmica é um dos principais pilares para vistos de trabalho, especialmente o EB1, EB2 (EB2 NIW).',
        'pos': 'Fantástico! Pós-graduação acelera significativamente processos EB-2 e aumenta suas chances no H1B.',
        'mestrado': 'Fantástico! Mestrado acelera significativamente processos EB-2 e aumenta suas chances no H1B.',
        'doutorado': 'Excepcional! Doutorado é altamente valorizado e pode qualificá-lo para o EB-1A (Habilidade Extraordinária).'
    },
    englishLevel: {
        'basico': 'Não se preocupe, a falta de fluência não impede a maioria dos processos. No entanto, é algo que podemos trabalhar juntos para melhorar.',
        'intermediario': 'Bom nível! Isso já é um diferencial importante para muitos processos de imigração.',
        'avancado': 'Isso é um grande diferencial! A fluência em inglês é muito valorizada por empregadores e é um ponto forte no seu perfil.',
        'fluente': 'Isso é um grande diferencial! A fluência em inglês é muito valorizada por empregadores e é um ponto forte no seu perfil.'
    },
    experience: {
        'menos-1': 'Todo profissional começou de algum lugar! Vamos focar em outras fortalezas do seu perfil.',
        '1-5': 'Boa experiência inicial! Isso já demonstra conhecimento prático na sua área.',
        '5-10': 'Sua experiência é um ativo muito valioso! Profissionais experientes são extremamente procurados nos EUA.',
        '10-plus': 'Sua experiência é um ativo muito valioso! Profissionais experientes são extremamente procurados nos EUA.'
    },
    hasLeadership: {
        'sim': 'Fantástico! Liderança e reconhecimento podem qualificar você para vistos de habilidade extraordinária, como o EB-1 ou o O-1.',
        'nao': 'Não há problema! Sua experiência técnica e outras qualificações são igualmente valiosas.'
    },
    hasRecognition: {
        'sim': 'Fantástico! Liderança e reconhecimento podem qualificar você para vistos de habilidade extraordinária, como o EB-1 ou o O-1, o caminho mais rápido para um Green Card.',
        'nao': 'Tudo bem! O mais importante é a sua experiência prática e qualificações técnicas.'
    },
    familyInUS: {
        'sim': 'Isso é uma grande vantagem! Vistos de família são uma das vias mais seguras e diretas para a imigração.',
        'nao': 'Não se preocupe! Há muitos outros caminhos através de qualificação profissional e outras habilidades.'
    },
    jobOffer: {
        'sim': 'Você encontrou o "bilhete de ouro"! Com uma oferta de emprego, seu processo de visto de trabalho se torna muito mais forte e focado.',
        'nao': 'Tudo bem! Muitos conseguem ofertas de emprego durante o processo ou usam outros caminhos.'
    },
    companyTransfer: {
        'sim': 'Essa é uma das formas mais comuns de imigração para executivos e profissionais especializados. O visto L-1 pode ser a sua opção!',
        'nao': 'Sem problemas! Existem muitas outras formas de conseguir oportunidades de trabalho nos EUA.'
    }
};

function getComment(questionId, value) {
    return COMMENTS[questionId]?.[value] || 'Informação registrada! Cada detalhe conta na avaliação de imigração.';
}
