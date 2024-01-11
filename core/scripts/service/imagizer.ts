import Cache from "../../utility/Cache";
import Imagizer from "../../services/imagizer/Imagizer";
import DockerImageManager from "../../services/imagizer/DockerImageManager";
import ImageConfigurationLoader from "../../services/imagizer/ImageConfigurationLoader";

const imageManager = new DockerImageManager();
const configLoader = new ImageConfigurationLoader(
    new Cache('templates/images'),
    new Cache('.cache-images'),
);
const imagizer = new Imagizer(imageManager, configLoader);

imagizer.run();
