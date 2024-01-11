import Cache from "../../utility/Cache";
import Containerizer from "../../services/containerizer/Containerizer";
import DockerContainerManager from "../../services/containerizer/DockerContainerManager";
import ContainerConfigurationLoader from "../../services/containerizer/ContainerConfigurationLoader";
import ImageConfigurationLoader from "../../services/imagizer/ImageConfigurationLoader";

const containerManager = new DockerContainerManager();
const containerCache = new Cache('.cache-containers');
const configLoader = new ContainerConfigurationLoader(
    new Cache('templates/containers'),
    containerCache,
);
const containerizer = new Containerizer(containerManager, configLoader);

const imageConfigLoader = new ImageConfigurationLoader(
    new Cache('templates/images'),
    new Cache('.cache-images'),
);
const differentImages = imageConfigLoader.getChangedConfigurations();
configLoader.getAllConfigurations().forEach((configuration) => {
    if (differentImages.find((differentImage) => (configuration.image === differentImage.tag || configuration.image === differentImage.id))) {
        try {
            containerCache.deleteCachedFile(configuration.id);
        } catch {
            console.log('Unable to delete cached file: ', configuration.id);
        }
    }
});

containerizer.run();
