import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./charList.scss";

const CharList = (props) => {
  // constructor(props) {
  //   super(props);
  //   this.charsRefs = [];
  // }

  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const limit = 9;

  // элемент класса MarvelService - объект ф-ции CharList
  const marvelService = new MarvelService();

  //в useEffect входят:
  //Жизненный цикл компонента - этап - Монтирование
  useEffect(() => {
    //при монтировании аргументов нет, значит MarvelService возьмет отступ по умолчанию
    onRequest();
  }, []);

  //loading - в процессе загрузки
  const onCharListLoading = () => {
    setNewItemsLoading(true);
  };

  //Смена статуса после загрузки персонажа
  //loaded - уже загружен
  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    //есть зависимость от предыдущего состояния
    setCharList((charList) => [...charList, ...newCharList]);
    setLoading(() => false);
    setNewItemsLoading(() => false);
    setOffset((offset) => offset + limit);
    setCharEnded(() => ended);
  };

  //при 400х ошибках (напр, 404 - стр. не существует)
  const onError = () => {
    setLoading(false);
    setError(true);
  };

  //Метод для загрузки карточек персонажей (при загрузке и по кнопке Загузить ещё)
  const onRequest = (offset) => {
    onCharListLoading();

    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  const charsRefs = useRef([]);

  // setCharRef = (ref) => this.charsRefs.push(ref);

  const focusOnChar = (index) => {
    charsRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    charsRefs.current[index].classList.add("char__item_selected");
    charsRefs.current[index].focus();
  };

  const onCharClick = (id, index) => {
    focusOnChar(index);
    //поднимаем id в props.onCharSelected на уровень выше
    props.onCharSelected(id);
  };

  const onKeyDown = (e, id, index) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      focusOnChar(index);
      //поднимаем id в props.onCharSelected на уровень выше
      props.onCharSelected(id);
    }
  };

  function renderItems(arr) {
    const items = arr.map((item, index) => {
      const { id, name, thumbnail } = item;
      let classItem = "char__item";
      if (
        thumbnail.includes(
          "i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
        )
      ) {
        classItem += " contain";
      }

      return (
        <li
          className={classItem}
          key={id}
          onClick={() => onCharClick(id, index)}
          tabIndex={0}
          ref={(element) => (charsRefs.current[index] = element)}
          onKeyDown={(e) => onKeyDown(e, id, index)}
        >
          <img src={thumbnail} alt={name} />
          <div className="char__name">{name}</div>
        </li>
      );
    });
    return items;
  }

  const elements = renderItems(charList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? elements : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      <ul className="char__grid">{content}</ul>
      <button
        className="button button__main button__long"
        disabled={newItemsLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">загрузить ещё</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
