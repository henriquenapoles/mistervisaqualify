import { VisaRecommendation } from '../types/form';

export function getVisaRecommendations(score: number): VisaRecommendation[] {
  if (score >= 81) {
    return [
      { name: 'EB-5 (Investidor)', description: 'Visto de investidor para Green Card', icon: 'fas fa-chart-line' },
      { name: 'EB-2 NIW', description: 'Interesse Nacional - Green Card', icon: 'fas fa-star' },
      { name: 'O-1', description: 'Habilidade Extraordinária', icon: 'fas fa-trophy' },
      { name: 'Vistos de Família', description: 'Reunião familiar - Green Card', icon: 'fas fa-heart' }
    ];
  } else if (score >= 61) {
    return [
      { name: 'EB-2 NIW', description: 'Interesse Nacional - Green Card', icon: 'fas fa-star' },
      { name: 'L1A', description: 'Transferência executiva', icon: 'fas fa-building' },
      { name: 'O-1', description: 'Habilidade Extraordinária', icon: 'fas fa-trophy' },
      { name: 'Vistos de Família', description: 'Se aplicável - Green Card', icon: 'fas fa-heart' }
    ];
  } else if (score >= 41) {
    return [
      { name: 'H1B', description: 'Trabalho especializado', icon: 'fas fa-briefcase' },
      { name: 'L1B', description: 'Transferência especializada', icon: 'fas fa-exchange-alt' },
      { name: 'O1 (se reconhecido)', description: 'Habilidade extraordinária', icon: 'fas fa-trophy' },
      { name: 'Vistos de Família', description: 'Se aplicável', icon: 'fas fa-heart' }
    ];
  } else if (score >= 21) {
    return [
      { name: 'F1/M1', description: 'Visto de estudante', icon: 'fas fa-graduation-cap' },
      { name: 'J1', description: 'Programa de intercâmbio', icon: 'fas fa-exchange-alt' },
      { name: 'H2B', description: 'Trabalho temporário', icon: 'fas fa-clock' }
    ];
  } else {
    return [
      { name: 'B1/B2', description: 'Turismo/Negócios (não imigrante)', icon: 'fas fa-plane' }
    ];
  }
}

export function getScoreMessage(score: number): string {
  if (score >= 81) {
    return 'Excelente potencial para diversas categorias de visto de imigrante. Seu perfil é muito forte e pode se qualificar para opções de Green Card.';
  } else if (score >= 61) {
    return 'Forte potencial para vistos de imigrante baseados em emprego ou família. Seu perfil é altamente competitivo.';
  } else if (score >= 41) {
    return 'Seu perfil é promissor para vistos de trabalho ou família. É essencial analisar detalhes específicos da sua experiência e qualificações.';
  } else if (score >= 21) {
    return 'Você pode ser elegível para vistos temporários. Recomenda-se aprimorar qualificações para opções de residência permanente.';
  } else {
    return 'Seu perfil atual sugere que as opções de visto de imigrante são limitadas. Foco em visitas temporárias e desenvolvimento de qualificações.';
  }
}
