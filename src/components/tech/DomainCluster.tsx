import React from "react";
import HexTile, { VaultItem } from "./HexTile";
import "../styles/vault.css";

export interface ClusterData {
  id: string;
  name: string;
  hue: string;
  borderRgba: string;
  glowRgba: string;
  bgGradient?: string;
  items: VaultItem[];
}

interface DomainClusterProps {
  cluster: ClusterData;
  hoveredItem: VaultItem | null;
  searchQuery: string;
  tileShape?: "hex" | "octagon";
  onTileHover: (item: VaultItem, elem: HTMLElement | null) => void;
  onTileLeave: () => void;
}

export const DomainCluster: React.FC<DomainClusterProps> = ({
  cluster,
  hoveredItem,
  searchQuery,
  tileShape = "hex",
  onTileHover,
  onTileLeave,
}) => {
  const query = searchQuery.trim().toLowerCase();

  // Filter items matching search if active
  const displayedItems = cluster.items.filter((item) => {
    if (!query) return true;
    const title = (item.name || item.title || "").toLowerCase();
    const tag = (item.tag || item.number || "").toLowerCase();
    const desc = (item.oneLiner || item.issuer || "").toLowerCase();
    const skills = (item.skills || []).map((s) => s.name.toLowerCase()).join(" ");
    return (
      title.includes(query) ||
      tag.includes(query) ||
      desc.includes(query) ||
      skills.includes(query)
    );
  });

  if (displayedItems.length === 0 && query) {
    return null;
  }

  return (
    <div
      className="domain-cluster-card"
      style={{
        borderColor: cluster.borderRgba,
        boxShadow: `0 8px 32px ${cluster.glowRgba}`,
      }}
      data-domain={cluster.id}
    >
      {/* Cluster Header */}
      <div className="domain-cluster-header">
        <div className="domain-cluster-title-wrap">
          <span
            className="domain-hue-dot"
            style={{
              backgroundColor: cluster.hue,
              color: cluster.hue,
            }}
          />
          <h3 className="domain-cluster-title">{cluster.name}</h3>
        </div>

        <span className="domain-count-badge">
          {displayedItems.length} {displayedItems.length === 1 ? "credential" : "credentials"}
        </span>
      </div>

      {/* Honeycomb Grid */}
      <div className={`honeycomb-grid layout-${tileShape}`}>
        {displayedItems.map((item) => {
          const isDirectlyHovered = hoveredItem?.id === item.id;
          const relations = hoveredItem?.relatedTo || hoveredItem?.relatedIds || [];
          const isRelatedToHover = relations.includes(item.id);
          const title = (item.name || item.title || "").toLowerCase();
          const isMatchingSearch = query.length > 0 && title.includes(query);

          const isHighlighted = isDirectlyHovered || isRelatedToHover || isMatchingSearch;
          const isDimmed =
            (hoveredItem !== null && !isHighlighted) ||
            (query.length > 0 && !isMatchingSearch);

          return (
            <HexTile
              key={item.id}
              item={item}
              tileShape={tileShape}
              isDimmed={isDimmed}
              isHighlighted={isHighlighted}
              onHover={onTileHover}
              onLeave={onTileLeave}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DomainCluster;
