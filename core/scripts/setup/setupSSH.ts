import SSHConfiguration from "../../services/ssh/SSHConfiguration";
import Cache from "../../utility/Cache";
import SSHInitializer from "../../services/ssh/SSHInitializer";

const sshConfig = new SSHConfiguration('/etc/ssh/sshd_config');
const sshInitializer = new SSHInitializer(new Cache('.cache'), sshConfig);

sshInitializer.initialize();
