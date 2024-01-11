import Firewall from "../../services/firewall/Firewall";
import Cache from "../../utility/Cache";
import FirewallConfiguration from "../../services/firewall/FirewallConfiguration";
import FirewallDFirewallCommandConverter from "../../services/firewall/FirewallDFirewallCommandConverter";
import ContainerConfigurationLoader from "../../services/containerizer/ContainerConfigurationLoader";

const firewallConfiguration = new FirewallConfiguration();
firewallConfiguration.generateFromFiles();

const containerConfigLoader = new ContainerConfigurationLoader(
    new Cache('templates/containers'),
    new Cache('.cache-containers'),
);
firewallConfiguration.loadRulesFromContainerConfigurations(containerConfigLoader);

const firewallCommandConverter = new FirewallDFirewallCommandConverter();

const firewall = new Firewall(firewallConfiguration, firewallCommandConverter);
firewall.resetFirewallToConfiguration();