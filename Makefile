default:

build:
	docker run --rm -i \
		-v "$(CURDIR):$(CURDIR)" \
		-w "$(CURDIR)" \
		node:10-alpine \
		sh -exc "npm ci && npm run build && rm -rf node_modules && chown $(shell id -u):$(shell id -g) app.js"
