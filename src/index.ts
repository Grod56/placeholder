import { getPlaiceholder } from "plaiceholder";
import withPlaiceholder from "@plaiceholder/next";
import { NextConfig } from "next";

type ImagePlaceholder = `data:image/${string}`;

type PlaceholderRepository = {
	findPlaceholder: (src: string) => Promise<ImagePlaceholder | null>;
	setPlaceholder: (
		src: string,
		placeholder: ImagePlaceholder,
	) => Promise<void>;
};

async function getPlaceholder(
	src: string,
	placeholderRepository?: PlaceholderRepository,
): Promise<ImagePlaceholder> {
	const placeholder = await placeholderRepository?.findPlaceholder(src);
	if (placeholder) return placeholder;

	const buffer = await fetch(src).then(async (res) =>
		Buffer.from(await res.arrayBuffer()),
	);
	const { base64 } = await getPlaiceholder(buffer, { size: 10 });
	await placeholderRepository?.setPlaceholder(
		src,
		base64 as ImagePlaceholder,
	);
	return base64 as ImagePlaceholder;
}

function withPlaceholderConfig(config: NextConfig) {
	return withPlaiceholder(config);
}

export {
	ImagePlaceholder,
	PlaceholderRepository,
	getPlaceholder,
	withPlaceholderConfig,
};
