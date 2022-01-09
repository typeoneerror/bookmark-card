/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Button, Placeholder, Spinner, ToolbarGroup } from '@wordpress/components';
import { BlockControls, BlockIcon } from '@wordpress/block-editor';
import { getAuthority } from '@wordpress/url';

/**
 * Internal dependencies
 */
import fetchUrlData from './api';
import bookmarkIcon from './icon';

export default function Edit( {
	attributes,
	className,
	isSelected,
	setAttributes,
} ) {
	const {
		url,
		image,
		title,
		description,
		icon,
		publisher
	} = attributes;

	const [ fetchUrl, setFetchUrl ] = useState( url );
	const [ interactive, setInteractive ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isEditing, setIsEditing ] = useState( false );

	useEffect( () => {
		if ( ! isSelected && interactive ) {
			setInteractive( false );
		}
	}, [ isSelected, interactive ] );

	function onSubmit( event ) {
		if ( event ) {
			event.preventDefault();
		}

		setIsEditing( false );
		setIsLoading( true );

		fetchUrlData( fetchUrl )
			.then( ( response ) => {
				setAttributes( {
					...response,
					url: fetchUrl,
					publisher: getAuthority( fetchUrl )
				} );
				setIsEditing( false );
				setIsLoading( false );
			} )
			.catch( () => {
				// @todo display notice.
				setIsEditing( true );
				setIsLoading( false );
			} );
	}

	if ( isLoading ) {
		return (
			<div className="wp-block-embed is-loading">
				<Spinner />
				<p>{ __( 'Loading', 'bookmark-card' ) }</p>
			</div>
		);
	}

	if ( ! title || isEditing ) {
		return (
			<Placeholder
				icon={ <BlockIcon icon={ bookmarkIcon } /> }
				label={ __( 'Site URL', 'bookmark-card' ) }
				className="wp-block-embed"
				instructions={ __(
					'Enter URL to convert into a bookmark card.',
					'bookmark-card'
				) }
			>
				<form onSubmit={ onSubmit }>
					<input
						type="url"
						value={ fetchUrl || '' }
						className="components-placeholder__input"
						aria-label={ __( 'Site URL', 'bookmark-card' ) }
						placeholder={ __( 'Enter URL here…', 'bookmark-card' ) }
						onChange={ ( event ) => setFetchUrl( event.target.value ) }
					/>
					<Button isPrimary type="submit">
						{ _x( 'Submit', 'button label', 'bookmark-card' ) }
					</Button>
				</form>
			</Placeholder>
		);
	}

	const toolbarControls = [
		{
			icon: 'edit',
			title: __( 'Edit URL', 'bookmark-card' ),
			onClick: () => setIsEditing( true ),
		},
	];

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={ toolbarControls } />
			</BlockControls>
			<figure className={ className }>
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
			{ ! interactive && (
				<div
					className="block-library-embed__interactive-overlay"
					onMouseUp={ () => setInteractive( true ) }
				/>
			) }
		</>
	);
}
