// Marcador para los módulos que todavía no fueron desarrollados.
export default function ProximamentePage({ titulo }: { titulo: string }) {
  return (
    <section>
      <h2>{titulo}</h2>
      <p className="texto-suave">Este módulo se encuentra en desarrollo.</p>
    </section>
  );
}
