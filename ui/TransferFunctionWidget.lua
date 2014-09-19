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

    if (widget.Extents.xMin > widget.Extents.xMax) then
        widget.Extents = {xMin=5, yMin=3, zMin=0, xMax=100,yMax=50,zMax=0.0};
    end

    print("Running TransferFunctionWidget: "..widget.Name..":createGraphics()");
    print("  extents ", widget.Extents);


    local geometry = new("osg::Geometry");
    local vertices = new("osg::Vec3Array");
    geometry.VertexArray = vertices;

    local colours = new("osg::Vec4Array");
    colours.Binding = "BIND_PER_PRIMITIVE_SET"
    geometry.ColorArray = colours;


    local primitives = new("osg::DrawElementsUShort");

    geometry.PrimitiveSetList:add(primitives);

    widget:addChild(geometry);

    print("geometry ",geometry);
    print("vertices ",vertices);
    print("colours ",colours);

    vertices:add({x=widget.Extents.xMin, y=widget.Extents.yMin, z=widget.Extents.zMin});
    vertices:add({x=widget.Extents.xMin, y=widget.Extents.yMax, z=widget.Extents.zMin});
    vertices:add({x=widget.Extents.xMax, y=widget.Extents.yMin, z=widget.Extents.zMin});
    vertices:add({x=widget.Extents.xMax, y=widget.Extents.yMax, z=widget.Extents.zMin});

    colours:add({red=0.0,green=1.0,blue=1.0,alpha=1.0});

    primitives.Mode = "TRIANGLES";
    primitives:add(1);
    primitives:add(0);
    primitives:add(2);
    primitives:add(3);
    primitives:add(1);
    primitives:add(2);

    widget:createGraphicsImplementation();

end

return widget;
end

