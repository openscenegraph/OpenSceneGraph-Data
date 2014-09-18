return function(extents)

local widget = new("osgUI::Widget");

widget.Name = "TransferFunctionWidget";

if (extents) then
    widget.Extents = extents;
end

widget.load = function(widget, filename)

    local obj = readObjectFile(filename);
    print("widget.load", filename, obj);
end

widget.createGraphics = function(widget)

    print("Running TransferFunctionWidget: "..widget.Name..":createGraphics()");
    print("  extents ", widget.Extents);

    widget:createGraphicsImplementation();

end

return widget;
end

