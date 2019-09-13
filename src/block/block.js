//  Import CSS.
import './editor.scss';

import {
	SVG,
	Path,
} from '@wordpress/components';

import { useState } from '@wordpress/element';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const { InnerBlocks } = wp.editor;

// these are the template options - just add more options here if there is a demand for it
// the width gets applied to the individual column as an attribute, and the user has no way to change that attribute
const TEMPLATE_OPTIONS = [
	{
		title: __( 'Two columns; equal split' ),
		icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" clipRule="evenodd" d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H25V34H39ZM23 34H9V14H23V34Z" /></SVG>,
		template: [
			[ 'rawb/column-block', { width: '1/2' } ],
			[ 'rawb/column-block', { width: '1/2' } ],
		],
	},
	{
		title: __( 'Two columns; one-third, two-thirds split' ),
		icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" clipRule="evenodd" d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H20V34H39ZM18 34H9V14H18V34Z" /></SVG>,
		template: [
			[ 'rawb/column-block', { width: '1/3' } ],
			[ 'rawb/column-block', { width: '2/3' } ],
		],
	},
	{
		title: __( 'Two columns; two-thirds, one-third split' ),
		icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" clipRule="evenodd" d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H30V34H39ZM28 34H9V14H28V34Z" /></SVG>,
		template: [
			[ 'rawb/column-block', { width: '2/3' } ],
			[ 'rawb/column-block', { width: '1/3' } ],
		],
	},
	{
		title: __( 'Three columns; equal split' ),
		icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" d="M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM28.5 34h-9V14h9v20zm2 0V14H39v20h-8.5zm-13 0H9V14h8.5v20z" /></SVG>,
		template: [
			[ 'rawb/column-block', { width: '1/3' } ],
			[ 'rawb/column-block', { width: '1/3' } ],
			[ 'rawb/column-block', { width: '1/3' } ],
		],
	},
	{
		title: __( 'Three columns; wide center column' ),
		icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" d="M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM31 34H17V14h14v20zm2 0V14h6v20h-6zm-18 0H9V14h6v20z" /></SVG>,
		template: [
			[ 'rawb/column-block', { width: '1/4' } ],
			[ 'rawb/column-block', { width: '1/2' } ],
			[ 'rawb/column-block', { width: '1/4' } ],
		],
	},
];

registerBlockType( 'rawb/columns-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Columns Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'columns' ),
		__( 'column' ),
	],
	attributes: {
		template: { type: 'array' },
	},

	edit: function( props ) {
		// import the current template as currentTemplate
		const { template: currentTemplate } = props.attributes;

		// use the currentTemplate as default state (if there is one);
		// if the template value is null, the user will be prompted to select a template
		const [ template, setTemplate ] = useState( currentTemplate ? currentTemplate : null );

		// 1. Set the new template as an attribute
		// 2. Set the new template as local state
		function updateTemplate( newTemplate ) {
			props.setAttributes( { newTemplate } );
			setTemplate( newTemplate );
		}

		// this gives the columns editor block a class that specifices which column template is selected, se the .scss file for details
		const columnsClassName = template ? 'columns' + template.map( column => column[ 1 ].width.replace( '/', '-' ) ).join( '_' ) : '';

		return (
			<div className={ `${ props.className } ${ columnsClassName }` }>
				<InnerBlocks
					// the template from local state
					template={ template }
					// function to render the block appender -  we don't want the user to add blocks, so we don't render one
					renderAppender={ () => null }
					// experimental feature for template options and template selection
					__experimentalTemplateOptions={ TEMPLATE_OPTIONS }
					__experimentalOnSelectTemplateOption={ updateTemplate }
					// lock this template down - the user cannot add or remove columns
					templateLock="all"
				/>
			</div>
		);
	},

	save: function() {
		return (
			<div>
				<InnerBlocks.Content />
			</div>
		);
	},
} );
