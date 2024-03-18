import { Component } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./charList.scss";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
  };

  // элемент класса MarvelService - св-во класса RandomChar
  marvelService = new MarvelService();

  //Жизненный цикл компонента - этап - Монтирование
  componentDidMount() {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
  }

  //Смена статуса после загрузки персонажа
  onCharListLoaded = (charList) => {
    this.setState({ charList, loading: false });
  };

  //при 400х ошибках (напр, 404 - стр. не существует)
  onError = () => {
    this.setState({ loading: false, error: true });
  };

  renderItems(arr) {
    const items = arr.map((item) => {
      const { id, name, thumbnail } = item;
      const classThumbnail = thumbnail.includes(
        "i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      )
        ? "char__item contain"
        : "char__item";
      return (
        <li
          className={classThumbnail}
          key={id}
          onClick={() => this.props.onCharSelected(id)}
        >
          <img src={thumbnail} alt={name} />
          <div className="char__name">{name}</div>
        </li>
      );
    });
    return items;
  }

  render() {
    const { charList, loading, error } = this.state;

    const elements = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? elements : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        <ul className="char__grid">{content}</ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
