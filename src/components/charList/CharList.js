import { Component, createRef } from "react";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./charList.scss";

class CharList extends Component {
  constructor(props) {
    super(props);
    this.charsRefs = [];
  }
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemsLoading: false,
    offset: 210,
    limit: 9,
    charEnded: false,
  };

  // элемент класса MarvelService - св-во класса RandomChar
  marvelService = new MarvelService();

  //Жизненный цикл компонента - этап - Монтирование
  componentDidMount() {
    //при монтировании аргументов нет, значит MarvelService возьмет отступ по умолчанию
    this.onRequest();
  }

  //Метод для загрузки карточек персонажей (при загрузке и по кнопке Загузить ещё)
  onRequest = (offset) => {
    this.onCharListLoading();

    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  //loading - в процессе загрузки
  onCharListLoading = () => {
    this.setState({ newItemsLoading: true });
  };

  //Смена статуса после загрузки персонажа
  //loaded - уже загружен
  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    //есть зависимость от предыдущего состояния
    this.setState(({ limit, offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemsLoading: false,
      offset: offset + limit,
      charEnded: ended,
    }));
  };

  //при 400х ошибках (напр, 404 - стр. не существует)
  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onCharClick = (item) => {
    console.log(item);
    console.log(this.charsRefs);

    //поднимаем id в props.onCharSelected на уровень выше
    this.props.onCharSelected(item.id);
  };

  onKeyDown = (e, id) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      //поднимаем id в props.onCharSelected на уровень выше
      this.props.onCharSelected(id);
    }
  };

  renderItems(arr) {
    const items = arr.map((item) => {
      let { id, name, thumbnail, classItem } = item;

      classItem = "char__item";

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
          onClick={() => this.onCharClick(item)}
          tabIndex={0}
          ref={(ref) => this.charsRefs.push(ref)}
          onKeyDown={(e) => this.onKeyDown(e, id)}
        >
          <img src={thumbnail} alt={name} />
          <div className="char__name">{name}</div>
        </li>
      );
    });
    return items;
  }

  render() {
    const { charList, loading, error, offset, newItemsLoading, charEnded } =
      this.state;

    const elements = this.renderItems(charList);

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
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">загрузить ещё</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
