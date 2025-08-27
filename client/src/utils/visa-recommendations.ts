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

export function generatePersonalizedReport(formData: any, score: number): string {
  let report = [];
  
  // Analyze objective
  const objective = formData.objective;
  if (objective === 'trabalho') {
    report.push("Seu foco em oportunidades de trabalho nos EUA é estratégico.");
  } else if (objective === 'investimento') {
    report.push("Seu interesse em investimentos nos EUA demonstra visão empresarial.");
  } else if (objective === 'estudo') {
    report.push("Buscar educação nos EUA é um investimento valioso no futuro.");
  }
  
  // Analyze capital
  const capital = formData.capital;
  if (capital === 'mais-1m') {
    report.push("Seu capital disponível oferece acesso a programas premium como EB-5.");
  } else if (capital === '500k-1m') {
    report.push("Seu capital qualifica você para programas de investidor EB-5.");
  } else if (capital === '20k-500k') {
    report.push("Seu capital permite explorar vistos E-2 e outras oportunidades.");
  } else {
    report.push("Vistos baseados em trabalho e estudo são suas melhores opções iniciais.");
  }
  
  // Analyze education
  const education = formData.education;
  if (education === 'doutorado') {
    report.push("Seu PhD é um diferencial competitivo significativo, qualificando para EB-1.");
  } else if (education === 'mestrado') {
    report.push("Seu mestrado acelera processos EB-2 Advanced Degree.");
  } else if (education === 'graduacao') {
    report.push("Sua graduação é base sólida para H1B e outros vistos profissionais.");
  }
  
  // Analyze English
  const englishLevel = formData.englishLevel;
  if (englishLevel === 'fluente') {
    report.push("Sua fluência em inglês elimina barreiras importantes.");
  } else if (englishLevel === 'basico') {
    report.push("Melhorar o inglês deve ser prioridade para sucesso nos EUA.");
  }
  
  // Analyze experience
  const experience = formData.experience;
  if (experience === '10-plus') {
    report.push("Sua experiência excepcional de 10+ anos qualifica você para posições de liderança e EB-1.");
  } else if (experience === '5-10') {
    report.push("Seus 5-10 anos de experiência são ideais para posições sênior e H1B avançado.");
  } else if (experience === '1-5') {
    report.push("Sua experiência de 1-5 anos é adequada para H1B e desenvolvimento profissional.");
  }
  
  // Analyze family status
  if (formData.maritalStatus === 'casado-filhos') {
    report.push("Família pode imigrar junta, valorizando educação americana para os filhos.");
  } else if (formData.maritalStatus === 'casado') {
    report.push("Cônjuge pode trabalhar nos EUA com visto dependente.");
  }
  
  // Analyze US connections
  if (formData.jobOffer === 'sim') {
    report.push("Oferta de emprego americana é vantagem decisiva para H1B.");
  }
  if (formData.familyInUS === 'sim') {
    report.push("Família nos EUA facilita processos de reunificação familiar.");
  }
  if (formData.companyTransfer === 'sim') {
    report.push("Transferência interna via L-1 é caminho promissor.");
  }
  
  return report.join(" ");
}

export function getScoreMessage(score: number): string {
  if (score >= 81) {
    return 'Excelente potencial para diversas categorias de visto de imigrante. Seu perfil demonstra forte qualificação para opções de Green Card.';
  } else if (score >= 61) {
    return 'Forte potencial para vistos de imigrante baseados em emprego ou família. Seu perfil apresenta características altamente competitivas.';
  } else if (score >= 41) {
    return 'Seu perfil demonstra potencial promissor para vistos de trabalho ou família. Análise detalhada das suas qualificações pode revelar oportunidades específicas.';
  } else if (score >= 21) {
    return 'Você apresenta potencial para vistos temporários. Aprimoramento estratégico das qualificações pode abrir opções de residência permanente.';
  } else {
    return 'Seu perfil atual indica potencial limitado para vistos de imigrante. Foco em visitas temporárias e desenvolvimento estruturado de qualificações.';
  }
}
