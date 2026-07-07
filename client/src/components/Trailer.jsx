export default function Trailer({ youtubeKey, title }) {
  if (!youtubeKey) {
    return <p className="trailer trailer--missing">No trailer available for this movie.</p>;
  }

  return (
    <div className="trailer">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeKey}`}
        title={`${title} trailer`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
