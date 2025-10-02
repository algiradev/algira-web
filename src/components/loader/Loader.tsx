import styles from "./Loader.module.css";
import { Triangle } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <Triangle
        height="110"
        width="110"
        color="#177078"
        ariaLabel="triangle-loading"
        wrapperStyle={{ position: "absolute", marginTop: "15" }}
        visible={true}
      />

      <Triangle
        height="200"
        width="200"
        color="#177078"
        ariaLabel="triangle-loading"
        wrapperStyle={{ position: "absolute", marginTop: "-20" }}
        visible={true}
      />

      <Triangle
        height="150"
        width="300"
        color="#177078"
        ariaLabel="triangle-loading"
        wrapperStyle={{ position: "absolute" }}
        visible={true}
      />
    </div>
  );
};

export default Loader;
