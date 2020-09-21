export default function Card( {
	url,
	image,
	title,
	description,
	icon,
	publisher,
} ) {
	return (
		<figure className="bookmark-card-container">
			<a className="bookmark-card" href={ url }>
				{ image && (
					<div className="bookmark-card__image">
						<img src={ image } />
					</div>
				) }
				<div className="bookmark-card__content">
					<div className="bookmark-card__title">{ title }</div>
					<div className="bookmark-card__description">
						{ description }
					</div>
					<div className="bookmark_card__meta">
						{ icon && (
							<img
								className="bookmark_card__meta-icon"
								src={ icon }
							/>
						) }
						<span className="bookmark_card__meta-publisher">
							{ publisher }
						</span>
					</div>
				</div>
			</a>
		</figure>
	);
}