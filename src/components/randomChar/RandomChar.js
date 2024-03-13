import { Component } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

class RandomChar extends Component {
  constructor(props) {
    super(props);
    this.updateChar();
  }
  state = {
    char: {},
    loading: true,
    error: false,
  };

  // элемент класса MarvelService - св-во класса RandomChar
  marvelService = new MarvelService();

  //Смена статуса после загрузки персонажа
  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

  //при 400х ошибках (напр, 404 - стр. не существует)
  onError = () => {
    this.setState({ loading: false, error: true });
  };

  updateChar = () => {
    //ошибка. такого нет
    // const id = 101710035548;
    // const id = 1017100;
    const id = Math.floor(Math.random() * (1011400 - 1011005) + 1011005);

    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  render() {
    const { char, loading, error } = this.state;
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
          <button className="button button__main">
            <div className="inner">попробуй</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className="randomchar__img" />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
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
