class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=74633dcc74eaab92fbc7d96bab355160";
  getResource = async (url) => {
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  //получить всех персонажей
  getAllCharacters = async () => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  //получить 1 персонажа
  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = (char) => {
    let descr = char.description
      ? char.description.slice(0, 150) + "..."
      : "Описание отсутствует";

    return {
      id: char.id,
      name: char.name,
      description: descr,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
