/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { Fragment } from 'react'
import { uniq } from 'lodash'
import { Container, SvgWrapper } from '@nivo/core'
import { BoxLegendSvg } from '@nivo/legends'
import { SankeyPropTypes } from './props'
import enhance from './enhance'
import SankeyNodes from './SankeyNodes'
import SankeyLinks from './SankeyLinks'
import SankeyLabels from './SankeyLabels'

const Sankey = ({
    nodes,
    links,
    layout,

    margin,
    width,
    height,
    outerWidth,
    outerHeight,

    nodeOpacity,
    nodeHoverOpacity,
    nodeHoverOthersOpacity,
    nodeBorderWidth,
    getNodeBorderColor, // computed
    setCurrentNode, // injected
    currentNode, // injected

    linkOpacity,
    linkHoverOpacity,
    linkHoverOthersOpacity,
    linkContract,
    linkBlendMode,
    enableLinkGradient,
    setCurrentLink, // injected
    currentLink, // injected

    enableLabels,
    labelPosition,
    labelPadding,
    labelOrientation,
    getLabelTextColor, // computed

    theme,

    nodeTooltip,
    linkTooltip,

    animate,
    motionDamping,
    motionStiffness,

    isInteractive,
    onClick,
    tooltipFormat,

    legends,
    legendData,

    layers,
}) => {
    let isCurrentNode = () => false
    let isCurrentLink = () => false

    if (currentLink) {
        isCurrentNode = ({ id }) => id === currentLink.source.id || id === currentLink.target.id
        isCurrentLink = ({ source, target }) =>
            source.id === currentLink.source.id && target.id === currentLink.target.id
    }

    if (currentNode) {
        let currentNodeIds = [currentNode.id]
        links
            .filter(
                ({ source, target }) => source.id === currentNode.id || target.id === currentNode.id
            )
            .forEach(({ source, target }) => {
                currentNodeIds.push(source.id)
                currentNodeIds.push(target.id)
            })

        currentNodeIds = uniq(currentNodeIds)
        isCurrentNode = ({ id }) => currentNodeIds.includes(id)
        isCurrentLink = ({ source, target }) =>
            source.id === currentNode.id || target.id === currentNode.id
    }

    return (
        <Container
            isInteractive={isInteractive}
            theme={theme}
            animate={animate}
            motionDamping={motionDamping}
            motionStiffness={motionStiffness}
        >
            {({ showTooltip, hideTooltip }) => {
                const layerProps = {
                    links,
                    nodes,
                    margin,
                    width,
                    height,
                    outerWidth,
                    outerHeight,
                }

                const layerById = {
                    links: (
                        <SankeyLinks
                            key="links"
                            links={links}
                            layout={layout}
                            linkContract={linkContract}
                            linkOpacity={linkOpacity}
                            linkHoverOpacity={linkHoverOpacity}
                            linkHoverOthersOpacity={linkHoverOthersOpacity}
                            linkBlendMode={linkBlendMode}
                            enableLinkGradient={enableLinkGradient}
                            showTooltip={showTooltip}
                            hideTooltip={hideTooltip}
                            setCurrentLink={setCurrentLink}
                            currentNode={currentNode}
                            currentLink={currentLink}
                            isCurrentLink={isCurrentLink}
                            onClick={onClick}
                            tooltip={linkTooltip}
                            theme={theme}
                            tooltipFormat={tooltipFormat}
                            animate={animate}
                            motionDamping={motionDamping}
                            motionStiffness={motionStiffness}
                        />
                    ),
                    nodes: (
                        <SankeyNodes
                            key="nodes"
                            nodes={nodes}
                            nodeOpacity={nodeOpacity}
                            nodeHoverOpacity={nodeHoverOpacity}
                            nodeHoverOthersOpacity={nodeHoverOthersOpacity}
                            nodeBorderWidth={nodeBorderWidth}
                            getNodeBorderColor={getNodeBorderColor}
                            showTooltip={showTooltip}
                            hideTooltip={hideTooltip}
                            setCurrentNode={setCurrentNode}
                            currentNode={currentNode}
                            currentLink={currentLink}
                            isCurrentNode={isCurrentNode}
                            onClick={onClick}
                            tooltip={nodeTooltip}
                            theme={theme}
                            tooltipFormat={tooltipFormat}
                            animate={animate}
                            motionDamping={motionDamping}
                            motionStiffness={motionStiffness}
                        />
                    ),
                    labels: null,
                    legends: legends.map((legend, i) => (
                        <BoxLegendSvg
                            key={`legend${i}`}
                            {...legend}
                            containerWidth={width}
                            containerHeight={height}
                            data={legendData}
                            theme={theme}
                        />
                    )),
                }

                if (enableLabels) {
                    layerById.labels = (
                        <SankeyLabels
                            key="labels"
                            nodes={nodes}
                            layout={layout}
                            width={width}
                            height={height}
                            labelPosition={labelPosition}
                            labelPadding={labelPadding}
                            labelOrientation={labelOrientation}
                            getLabelTextColor={getLabelTextColor}
                            theme={theme}
                            animate={animate}
                            motionDamping={motionDamping}
                            motionStiffness={motionStiffness}
                        />
                    )
                }

                return (
                    <SvgWrapper
                        width={outerWidth}
                        height={outerHeight}
                        margin={margin}
                        theme={theme}
                    >
                        {layers.map((layer, i) => {
                            if (typeof layer === 'function') {
                                return <Fragment key={i}>{layer(layerProps)}</Fragment>
                            }

                            return layerById[layer]
                        })}
                    </SvgWrapper>
                )
            }}
        </Container>
    )
}

Sankey.propTypes = SankeyPropTypes

const enhancedSankey = enhance(Sankey)
enhancedSankey.displayName = 'Sankey'

export default enhancedSankey
