import imgError from "./error.gif";

const ErrorMessage = () => {
  //это пример использования данных из папки public
  //Данные туда лучше не класть
  //process.env.PUBLIC_URL - переменная окружения для использования из папки public
  //return <img src={process.env.PUBLIC_URL + "/error.gif"} alt="" />;

  return (
    <img
      src={imgError}
      alt="Error"
      style={{
        display: "block",
        width: "250px",
        height: "250px",
        objectFit: "contain",
        margin: "0 auto",
      }}
    />
  );
};

export default ErrorMessage;
