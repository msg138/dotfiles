import WebhookService from "../../services/webhook/WebhookService";
import Cache from "../../utility/Cache";
import WebhookRepoActionFactory from "../../services/webhook/WebhookRepoActionFactory";

const webhookRepoActionFactory = new WebhookRepoActionFactory();
const webhookService = new WebhookService(new Cache('.cache'), webhookRepoActionFactory);

webhookService.run().then(() => {
    process.exit(0);
}).catch(() => {
    process.exit(1);
});
