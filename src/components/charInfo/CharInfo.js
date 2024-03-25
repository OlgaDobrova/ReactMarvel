import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // элемент класса MarvelService - объект CharInfo
  const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  //Смена статуса после загрузки персонажа
  const onCharLoaded = (char) => {
    setChar(char);
    setLoading(false);
  };

  //Смена статуса загрузки
  const onCharLoading = () => {
    setLoading(true);
    setError(false);
  };

  //при 400х ошибках (напр, 404 - стр. не существует)
  const onError = () => {
    setLoading(false);
    setError(true);
  };

  const updateChar = () => {
    const { charId } = props;

    if (!charId) {
      return;
    }

    //при загрузке персонажа ставлю спинер
    onCharLoading();
    marvelService.getCharacter(charId).then(onCharLoaded).catch(onError);
  };

  const skeleton = char || loading || error ? null : <Skeleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { id, name, description, thumbnail, homepage, wiki, comics } = char;
  const classThumbnail = thumbnail.includes(
    "i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  )
    ? "contain"
    : "";
  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} className={classThumbnail} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">о персонаже</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {id}
        <br />
        {description}
      </div>
      <div className="char__comics">Комиксы:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "Список пуст"}
        {comics.map((item, i) => {
          if (i > 9) return;
          return (
            <li className="char__comics-item" key={i}>
              <a href={item.resourceURI} target="_blank" rel="noreferrer">
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
