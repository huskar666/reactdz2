import { useState, useEffect } from 'react';

const API_KEY = 'YOUR_PIXABAY_API_KEY';

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    fetch(
      `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then(res => res.json())
      .then(data => {
        setImages(prev => [...prev, ...data.hits]);
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  useEffect(() => {
    const onEsc = e => {
      if (e.key === 'Escape') setModalImage(null);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const submitSearch = e => {
    e.preventDefault();
    setQuery(input);
    setImages([]);
    setPage(1);
  };

  return (
    <>
      <header className="searchbar">
        <form className="form" onSubmit={submitSearch}>
          <button type="submit" className="button">
            <span className="button-label">Search</span>
          </button>
          <input
            className="input"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </form>
      </header>

      <ul className="gallery">
        {images.map(img => (
          <li className="gallery-item" key={img.id}>
            <img
              src={img.webformatURL}
              alt=""
              onClick={() => setModalImage(img.largeImageURL)}
            />
          </li>
        ))}
      </ul>

      {loading && <div className="loader">Loading...</div>}

      {images.length > 0 && !loading && (
        <button className="load-more" onClick={() => setPage(p => p + 1)}>
          Load more
        </button>
      )}

      {modalImage && (
        <div className="overlay" onClick={() => setModalImage(null)}>
            <img src={modalImage} alt="" />
        </div>
      )}
    </>
  );
}

export default App;
