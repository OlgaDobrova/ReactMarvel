import { Component } from "react";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";
import MarvelService from "../../services/MarvelService";

class RandomChar extends Component {
  constructor(props) {
    super(props);
    this.updateChar();
  }
  state = {
    char: {},
  };

  // элемент класса MarvelService - св-во класса RandomChar
  marvelService = new MarvelService();

  onCharLoaded = (char) => {
    this.setState({ char });
  };

  updateChar = () => {
    // const id = 1017100;
    const id = Math.floor(Math.random() * (1011400 - 1011005) + 1011005);

    this.marvelService.getCharacter(id).then(this.onCharLoaded);
  };

  render() {
    const {
      char: { name, description, thumbnail, homepage, wiki },
    } = this.state;
    return (
      <div className="randomchar">
        <div className="randomchar__block">
          <img
            src={thumbnail}
            alt="Random character"
            className="randomchar__img"
          />
          <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">{description}</p>
            <div className="randomchar__btns">
              <a href="{homepage}" className="button button__main">
                <div className="inner">о персонаже</div>
              </a>
              <a href="{wiki}" className="button button__secondary">
                <div className="inner">Wiki</div>
              </a>
            </div>
          </div>
        </div>
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

export default RandomChar;
