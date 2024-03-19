import { Component } from "react";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };

  // элемент класса MarvelService - св-во класса RandomChar
  marvelService = new MarvelService();

  //Жизненный цикл компонента - этап - Монтирование
  componentDidMount() {
    this.updateChar();
  }

  //Жизненный цикл компонента - этап - Обновление (вызывается при обновлении props, state или при принудит обновлении)
  //аргументами получает предыдущие props и предыдущий state
  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  updateChar = () => {
    const { charId } = this.props;

    if (!charId) {
      return;
    }

    //при загрузке персонажа ставлю спинер
    this.onCharLoading();

    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  //Смена статуса после загрузки персонажа
  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

  //Смена статуса загрузки (для кнопки Попробуй)
  onCharLoading = () => {
    this.setState({ loading: true, error: false });
  };

  //при 400х ошибках (напр, 404 - стр. не существует)
  onError = () => {
    this.setState({ loading: false, error: true });
  };

  render() {
    const { char, loading, error } = this.state;

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
  }
}

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
