"use client";

import { useNode } from "@craftjs/core";
import React from "react";

interface CraftTextProps {
  text: string;
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  fontFamily: string;
  alignment: "left" | "center" | "right" | "justify";
  textColor: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline" | "line-through";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  letterSpacing: string;
  lineHeight: string;
  listStyle: "none" | "disc" | "circle" | "square" | "decimal" | "lower-alpha" | "upper-roman";
  linkUrl: string;
  openInNewTab: boolean;
  effect: "none" | "shadow" | "outline" | "glow";
  shadowColor: string;
  shadowBlur: string;
  shadowX: string;
  shadowY: string;
  outlineColor: string;
  outlineWidth: string;
  glowColor: string;
  glowSize: string;
  className?: string;
}

export const CraftText = ({
  text,
  tag,
  fontFamily,
  alignment,
  textColor,
  fontSize,
  fontWeight,
  fontStyle,
  textDecoration,
  textTransform,
  letterSpacing,
  lineHeight,
  listStyle,
  linkUrl,
  openInNewTab,
  effect,
  shadowColor,
  shadowBlur,
  shadowX,
  shadowY,
  outlineColor,
  outlineWidth,
  glowColor,
  glowSize,
  className,
}: CraftTextProps) => {
  const { connectors: { connect, drag } } = useNode();

  const alignmentMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const alignClass = alignmentMap[alignment] || "text-left";

  const themeSizeMap = {
    h1: "36px",
    h2: "28px",
    h3: "22px",
    h4: "18px",
    h5: "12px",
    h6: "10px",
    p: "14px",
  };

  const resolvedFontSize = fontSize || themeSizeMap[tag] || "14px";

  // Build inline styles
  const styleOverrides: React.CSSProperties = {
    fontFamily: fontFamily || "inherit",
    color: textColor || undefined,
    fontSize: resolvedFontSize,
    fontWeight: fontWeight || undefined,
    fontStyle: fontStyle || undefined,
    textDecoration: textDecoration || undefined,
    textTransform: textTransform || undefined,
    letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
    lineHeight: lineHeight ? lineHeight : undefined,
  };

  // Safe effect handling preventing artifact smears
  if (effect === "shadow") {
    styleOverrides.textShadow = `${shadowX || 2}px ${shadowY || 2}px ${shadowBlur || 4}px ${shadowColor || "rgba(0,0,0,0.6)"}`;
  } else if (effect === "outline") {
    const w = Number(outlineWidth) || 1;
    (styleOverrides as any).WebkitTextStroke = `${w * 2}px ${outlineColor || "#ffffff"}`;
    (styleOverrides as any).paintOrder = "stroke fill";
  } else if (effect === "glow") {
    styleOverrides.textShadow = `0 0 ${glowSize || 10}px ${glowColor || "#6366f1"}`;
  }

  const isNumbered = ["decimal", "lower-alpha", "upper-roman"].includes(listStyle);
  const listTag = isNumbered ? "ol" : "ul";
  const hasList = listStyle && listStyle !== "none";

  const contentNode = hasList ? (
    React.createElement(
      listTag,
      {
        style: { listStyleType: listStyle, paddingLeft: "1.2rem" },
        className: `cursor-pointer w-full ${alignClass}`,
      },
      <li>{text}</li>
    )
  ) : (
    text
  );

  const wrappedContent = linkUrl ? (
    <a 
      href={linkUrl} 
      target={openInNewTab ? "_blank" : "_self"} 
      rel="noopener noreferrer" 
      className="hover:underline inline-block w-full"
      onClick={(e) => e.preventDefault()}
    >
      {contentNode}
    </a>
  ) : (
    contentNode
  );

  const elementMap = {
    h1: <h1 ref={(ref) => { if (ref) connect(drag(ref)); }} style={styleOverrides} className={`font-black tracking-tight cursor-pointer w-full ${alignClass} ${className || ""}`}>{wrappedContent}</h1>,
    h2: <h2 ref={(ref) => { if (ref) connect(drag(ref)); }} style={styleOverrides} className={`font-bold tracking-tight cursor-pointer w-full ${alignClass} ${className || ""}`}>{wrappedContent}</h2>,
    h3: <h3 ref={(ref) => { if (ref) connect(drag(ref)); }} style={styleOverrides} className={`font-semibold cursor-pointer w-full ${alignClass} ${className || ""}`}>{wrappedContent}</h3>,
    h4: <h4 ref={(ref) => { if (ref) connect(drag(ref)); }} style={styleOverrides} className={`font-medium cursor-pointer w-full ${alignClass} ${className || ""}`}>{wrappedContent}</h4>,
    h5: <h5 ref={(ref) => { if (ref) connect(drag(ref)); }} style={styleOverrides} className={`font-medium cursor-pointer w-full ${alignClass} ${className || ""}`}>{wrappedContent}</h5>,
    h6: <h6 ref={(ref) => { if (ref) connect(drag(ref)); }} style={styleOverrides} className={`font-medium cursor-pointer w-full ${alignClass} ${className || ""}`}>{wrappedContent}</h6>,
    p: <p ref={(ref) => { if (ref) connect(drag(ref)); }} style={styleOverrides} className={`cursor-pointer w-full ${alignClass} ${className || "text-neutral-300"}`}>{wrappedContent}</p>,
  };

  return elementMap[tag] || elementMap.p;
};

const TextSettings = () => {
  const {
    actions: { setProp },
    text,
    tag,
    fontFamily,
    alignment,
    textColor,
    fontSize,
    fontWeight,
    fontStyle,
    textDecoration,
    textTransform,
    letterSpacing,
    lineHeight,
    listStyle,
    linkUrl,
    openInNewTab,
    effect,
    shadowColor,
    shadowBlur,
    shadowX,
    shadowY,
    outlineColor,
    outlineWidth,
    glowColor,
    glowSize,
  } = useNode((node) => ({
    text: node.data.props.text,
    tag: node.data.props.tag,
    fontFamily: node.data.props.fontFamily,
    alignment: node.data.props.alignment,
    textColor: node.data.props.textColor,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    fontStyle: node.data.props.fontStyle,
    textDecoration: node.data.props.textDecoration,
    textTransform: node.data.props.textTransform,
    letterSpacing: node.data.props.letterSpacing,
    lineHeight: node.data.props.lineHeight,
    listStyle: node.data.props.listStyle,
    linkUrl: node.data.props.linkUrl,
    openInNewTab: node.data.props.openInNewTab,
    effect: node.data.props.effect,
    shadowColor: node.data.props.shadowColor,
    shadowBlur: node.data.props.shadowBlur,
    shadowX: node.data.props.shadowX,
    shadowY: node.data.props.shadowY,
    outlineColor: node.data.props.outlineColor,
    outlineWidth: node.data.props.outlineWidth,
    glowColor: node.data.props.glowColor,
    glowSize: node.data.props.glowSize,
  }));

  return (
    <div className="space-y-4 pb-6">
      {/* 1. Content Section */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Text Content</label>
        <textarea
          value={text || ""}
          onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
          rows={3}
          className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      {/* 2. Theme / Tag Selection (Auto updates default sizing) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Text Theme / Tag</label>
        <select
          value={tag || "p"}
          onChange={(e) => setProp((props: any) => {
            props.tag = e.target.value;
          })}
          className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="h1">Site Title / H1 (36px)</option>
          <option value="h2">Heading 1 / H2 (28px)</option>
          <option value="h3">Heading 2 / H3 (22px)</option>
          <option value="h4">Heading 3 / H4 (18px)</option>
          <option value="p">Paragraph / Body Text (14px)</option>
        </select>
      </div>

      {/* 3. Font Family Selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Font Family</label>
        <select
          value={fontFamily || "inherit"}
          onChange={(e) => setProp((props: any) => (props.fontFamily = e.target.value))}
          className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="inherit">Default Sans-Serif</option>
          <option value="'Inter', sans-serif">Inter</option>
          <option value="'Georgia', serif">Georgia (Serif)</option>
          <option value="'Courier New', monospace">Courier (Monospace)</option>
          <option value="'Impact', sans-serif">Impact (Display)</option>
        </select>
      </div>

      {/* 4. Typography Styles & Color */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase opacity-50 block">Font Size (px)</label>
          <input
            type="number"
            placeholder="Auto scale"
            value={fontSize || ""}
            onChange={(e) => setProp((props: any) => (props.fontSize = e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase opacity-50 block">Text Color</label>
          <div className="flex items-center gap-2 bg-neutral-950 border border-white/10 rounded-lg px-2 py-1">
            <input
              type="color"
              value={textColor || "#ffffff"}
              onChange={(e) => setProp((props: any) => (props.textColor = e.target.value))}
              className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
            />
            <span className="text-xs text-neutral-300 font-mono">{textColor || "#ffffff"}</span>
          </div>
        </div>
      </div>

      {/* Font Weight & Style Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase opacity-50 block">Weight</label>
          <select
            value={fontWeight || "normal"}
            onChange={(e) => setProp((props: any) => (props.fontWeight = e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="bold">Bold</option>
            <option value="900">Black / Heavy</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase opacity-50 block">Decoration & Style</label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setProp((props: any) => (props.fontStyle = fontStyle === "italic" ? "normal" : "italic"))}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition ${fontStyle === "italic" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-neutral-950 border-white/10 text-neutral-400 hover:text-white"}`}
              title="Italic"
            >
              <i>I</i>
            </button>
            <button
              type="button"
              onClick={() => setProp((props: any) => (props.textDecoration = textDecoration === "underline" ? "none" : "underline"))}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition ${textDecoration === "underline" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-neutral-950 border-white/10 text-neutral-400 hover:text-white"}`}
              title="Underline"
            >
              <u>U</u>
            </button>
          </div>
        </div>
      </div>

      {/* Text Transform */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Text Transform</label>
        <select
          value={textTransform || "none"}
          onChange={(e) => setProp((props: any) => (props.textTransform = e.target.value))}
          className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="none">Normal (Default)</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="lowercase">lowercase</option>
          <option value="capitalize">Capitalize Words</option>
        </select>
      </div>

      {/* 5. Alignment Toolbar */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase opacity-50 block">Alignment</label>
        <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded-lg border border-white/10">
          {(["left", "center", "right", "justify"] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => setProp((props: any) => (props.alignment = align))}
              className={`py-1.5 text-xs rounded-md capitalize transition ${
                (alignment || "left") === align 
                  ? "bg-indigo-600 text-white font-medium shadow" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {align[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Lists & Formatting */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase opacity-50 block">List Format</label>
        <select
          value={listStyle || "none"}
          onChange={(e) => setProp((props: any) => (props.listStyle = e.target.value))}
          className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="none">Standard Text (No List)</option>
          <optgroup label="Bullet Lists">
            <option value="disc">Disc (Standard)</option>
            <option value="circle">Circle</option>
            <option value="square">Square</option>
          </optgroup>
          <optgroup label="Numbered Lists">
            <option value="decimal">Decimal (1, 2, 3)</option>
            <option value="lower-alpha">Lower Alpha (a, b, c)</option>
            <option value="upper-roman">Upper Roman (I, II, III)</option>
          </optgroup>
        </select>
      </div>

      {/* 7. Hyperlink Settings */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
        <span className="text-[9px] font-mono uppercase text-indigo-400 block">Hyperlink Destination</span>
        <div className="space-y-1.5">
          <label className="text-[9px] opacity-60 block">Target URL</label>
          <input
            type="text"
            placeholder="https://example.com"
            value={linkUrl || ""}
            onChange={(e) => setProp((props: any) => (props.linkUrl = e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="openNewTabCheck"
            checked={openInNewTab || false}
            onChange={(e) => setProp((props: any) => (props.openInNewTab = e.target.checked))}
            className="rounded bg-neutral-950 border-white/10 accent-indigo-600 cursor-pointer"
          />
          <label htmlFor="openNewTabCheck" className="text-[10px] text-neutral-300 cursor-pointer select-none">
            Open link in new tab
          </label>
        </div>
      </div>

      {/* 8. Character & Line Spacing */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase opacity-50 block">Letter Spacing (px)</label>
          <input
            type="number"
            value={letterSpacing || 0}
            onChange={(e) => setProp((props: any) => (props.letterSpacing = e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase opacity-50 block">Line Height</label>
          <input
            type="text"
            placeholder="e.g. 1.5"
            value={lineHeight || ""}
            onChange={(e) => setProp((props: any) => (props.lineHeight = e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 9. Visual Effects & Conditional Effect Properties */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase opacity-50 block">Visual Effect</label>
          <select
            value={effect || "none"}
            onChange={(e) => setProp((props: any) => (props.effect = e.target.value))}
            className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="none">None</option>
            <option value="shadow">Drop Shadow</option>
            <option value="outline">Outside Text Outline</option>
            <option value="glow">Outer Glow</option>
          </select>
        </div>

        {/* Drop Shadow Sub-Properties */}
        {effect === "shadow" && (
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
            <span className="text-[9px] font-mono uppercase text-indigo-400 block">Shadow Properties</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] opacity-60 block mb-1">Color</label>
                <input
                  type="color"
                  value={shadowColor || "#000000"}
                  onChange={(e) => setProp((props: any) => (props.shadowColor = e.target.value))}
                  className="w-full h-7 rounded border border-white/10 bg-transparent cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[9px] opacity-60 block mb-1">Blur Radius</label>
                <input
                  type="number"
                  value={shadowBlur || 4}
                  onChange={(e) => setProp((props: any) => (props.shadowBlur = e.target.value))}
                  className="w-full px-2 py-1 rounded bg-neutral-950 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] opacity-60 block mb-1">Offset X</label>
                <input
                  type="number"
                  value={shadowX || 2}
                  onChange={(e) => setProp((props: any) => (props.shadowX = e.target.value))}
                  className="w-full px-2 py-1 rounded bg-neutral-950 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[9px] opacity-60 block mb-1">Offset Y</label>
                <input
                  type="number"
                  value={shadowY || 2}
                  onChange={(e) => setProp((props: any) => (props.shadowY = e.target.value))}
                  className="w-full px-2 py-1 rounded bg-neutral-950 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Outside Text Outline Sub-Properties */}
        {effect === "outline" && (
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
            <span className="text-[9px] font-mono uppercase text-indigo-400 block">Outside Outline Properties</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] opacity-60 block mb-1">Outline Color</label>
                <input
                  type="color"
                  value={outlineColor || "#ffffff"}
                  onChange={(e) => setProp((props: any) => (props.outlineColor = e.target.value))}
                  className="w-full h-7 rounded border border-white/10 bg-transparent cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[9px] opacity-60 block mb-1">Thickness (px)</label>
                <input
                  type="number"
                  value={outlineWidth || 1}
                  onChange={(e) => setProp((props: any) => (props.outlineWidth = e.target.value))}
                  className="w-full px-2 py-1 rounded bg-neutral-950 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Outer Glow Sub-Properties */}
        {effect === "glow" && (
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
            <span className="text-[9px] font-mono uppercase text-indigo-400 block">Glow Properties</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] opacity-60 block mb-1">Glow Color</label>
                <input
                  type="color"
                  value={glowColor || "#6366f1"}
                  onChange={(e) => setProp((props: any) => (props.glowColor = e.target.value))}
                  className="w-full h-7 rounded border border-white/10 bg-transparent cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[9px] opacity-60 block mb-1">Glow Size</label>
                <input
                  type="number"
                  value={glowSize || 10}
                  onChange={(e) => setProp((props: any) => (props.glowSize = e.target.value))}
                  className="w-full px-2 py-1 rounded bg-neutral-950 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CraftText.craft = {
  props: { 
    text: "Sample Text Content", 
    tag: "p", 
    fontFamily: "inherit",
    alignment: "left",
    textColor: "#ffffff",
    fontSize: "",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textTransform: "none",
    letterSpacing: "0",
    lineHeight: "",
    listStyle: "none",
    linkUrl: "",
    openInNewTab: false,
    effect: "none",
    shadowColor: "#000000",
    shadowBlur: "4",
    shadowX: "2",
    shadowY: "2",
    outlineColor: "#ffffff",
    outlineWidth: "1",
    glowColor: "#6366f1",
    glowSize: "10",
    className: "" 
  },
  related: {
    settings: TextSettings,
    toolbar: TextSettings,
  },
};