<script>
	import { Router } from "@roxi/routify";
	import { routes } from "../.routify/routes";

	import {
    	provideFluentDesignSystem,
    	fluentBadge,
		fluentTextField,
		fluentButton,
		fluentAccordion,
   		fluentAccordionItem,
		fluentSelect,
    	fluentOption,
		fluentProgressRing,
	} from "@fluentui/web-components";

	provideFluentDesignSystem().register(
		fluentBadge(),
		fluentTextField(),
		fluentButton(),
		fluentAccordion(),
		fluentAccordionItem(),
		fluentSelect(),
		fluentOption(),
		fluentProgressRing(),
	);

</script>

<Router {routes} />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
