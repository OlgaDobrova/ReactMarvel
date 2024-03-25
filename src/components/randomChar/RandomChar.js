import { useState, useEffect } from "react";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

const RandomChar = () => {
  const [char, setChar] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // элемент класса MarvelService - объект RandomChar
  const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
    // timerID = setInterval(updateChar, 5000);

    //Удаление (Размонтирование)
    // return () => {
    //   window.clearInterval(timerID);
    // }
  }, []);

  //Смена статуса после загрузки персонажа
  const onCharLoaded = (char) => {
    setChar(char);
    setLoading(false);
  };

  //Смена статуса загрузки (для кнопки Попробуй)
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
    //ошибка. такого нет
    // const id = 101710035548;
    //SPIDER-MAN (ULTIMATE)
    // const id = 1011010;
    //Случайный
    const id = Math.floor(Math.random() * (1011400 - 1011005) + 1011005);

    //при загрузке персонажа ставлю спинер
    onCharLoading();

    marvelService.getCharacter(id).then(onCharLoaded).catch(onError);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? <View char={char} /> : null;

  return (
    <div className="randomchar">
      {/* если значение компонента null, то он не отрендерится */}
      {errorMessage}
      {spinner}
      {content}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Случайный персонаж на сегодня!
          <br />
          Хотите узнать его получше?
        </p>
        <p className="randomchar__title">Или выберите другого</p>
        <button className="button button__main" onClick={updateChar}>
          <div className="inner">попробуй</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

const View = ({ char }) => {
  const { id, name, description, thumbnail, homepage, wiki } = char;
  const classThumbnail = thumbnail.includes(
    "i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  )
    ? "randomchar__img contain"
    : "randomchar__img";
  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className={classThumbnail} />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">
          {id}
          <br />
          {description}
        </p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">о персонаже</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
