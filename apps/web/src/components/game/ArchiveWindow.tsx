export function ArchiveWindow() {
  return (
    <div className="window-content readme-content">
      <div className="program-menubar"><span>Arquivo</span><span>Editar</span><span>Formatar</span><span>Exibir</span><span>Ajuda</span></div>
      <div className="readme-paper">
        <h2>Bem-vindo ao Sentença Digital!</h2>
        <p>Sua missão é analisar casos reais sobre o uso irresponsável da IA.</p>
        <p>Lembre-se:</p>
        <ul>
          <li>Você não usa IA para decidir.</li>
          <li>Sua decisão tem consequências.</li>
          <li>Descubra o que realmente aconteceu.</li>
        </ul>
        <p className="cursor-blink">█</p>
      </div>
    </div>
  );
}
