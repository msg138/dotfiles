import WebhookInitializer from "../../services/webhook/WebhookInitializer";
import Cache from "../../utility/Cache";

const webhookInitializer = new WebhookInitializer(new Cache('.cache'));

webhookInitializer.initializeIfNotInitialized();
