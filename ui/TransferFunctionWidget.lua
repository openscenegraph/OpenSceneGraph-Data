return function(extents)

local WidgetUtils = require("WidgetUtils");
print(">>>>>>>>>>>>>> WidgetUtils ",WidgetUtils);
print(">>>>>>>>>>>>>> WidgetUtils ",WidgetUtils.createLabel);

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

    local extents = { xMin = widget.Extents.xMin,
                      yMin = widget.Extents.yMin+20.0,
                      zMin = widget.Extents.zMin,
                      xMax = widget.Extents.xMax,
                      yMax = widget.Extents.yMax,
                      zMax = widget.Extents.zMax };

    vertices:add({x=extents.xMin, y=extents.yMin, z=extents.zMin});
    vertices:add({x=extents.xMin, y=extents.yMax, z=extents.zMin});
    vertices:add({x=extents.xMax, y=extents.yMin, z=extents.zMin});
    vertices:add({x=extents.xMax, y=extents.yMax, z=extents.zMin});

    colours:add({red=0.0,green=1.0,blue=1.0,alpha=1.0});

    primitives.Mode = "TRIANGLES";
    primitives:add(1);
    primitives:add(0);
    primitives:add(2);
    primitives:add(3);
    primitives:add(1);
    primitives:add(2);


    local cs = 5.0;
    local lg = cs*1.5;
    local labelWidth = cs*13.0;
    local labelHeight = cs*1.3;
    local editWidth = cs*7.0;
    local editHeight = labelHeight;
    local margin = cs*0.35;

    local currentX = widget.Extents.xMin;
    local currentY = extents.yMin-margin-labelHeight;

    local width = cs*3.0;
    local x1 = currentX;
    local x2 = x1+width;
    local x3 = x2+width;
    local x4 = x3+width;
    local x5 = x4+width;
    local x6 = x5+width;
    local x7 = x6+width;
    local x8 = x7+width;

    widget:addChild(WidgetUtils.createLabel("Intensity", "Intensity", x1, currentY, x2-x1, labelHeight));
    widget:addChild(WidgetUtils.createLineEdit("IntensityEdit", x2, currentY, x3-x2-cs, editHeight, 1.0, 0.0, 1.0, 5));
    widget:addChild(WidgetUtils.createLabel("Alpha", "Alpha", x3, currentY, x3-x2, labelHeight));
    widget:addChild(WidgetUtils.createLineEdit("AlphaEdit", x4, currentY, x4-x3-cs, editHeight, 1.0, 0.0, 1.0, 5));
    widget:addChild(WidgetUtils.createLabel("Name", "Name", x5, currentY, x5-x4, labelHeight));
    widget:addChild(WidgetUtils.createLineEdit("NameEdit", x6, currentY, x8-x6, editHeight));

    currentY = currentY-lg;

    widget:addChild(WidgetUtils.createLabel("Red", "Red", x1, currentY, x2-x1, labelHeight));
    widget:addChild(WidgetUtils.createLineEdit("ReadEdit", x2, currentY, x3-x2-cs, editHeight, 1.0, 0.0, 255.0, 5));
    widget:addChild(WidgetUtils.createLabel("Green", "Green", x3, currentY, x4-x3, labelHeight));
    widget:addChild(WidgetUtils.createLineEdit("GreenEdit", x4, currentY, x5-x4-cs, editHeight, 1.0, 0.0, 255.0, 5));
    widget:addChild(WidgetUtils.createLabel("Blue", "Blue", x5, currentY, x6-x5, labelHeight));
    widget:addChild(WidgetUtils.createLineEdit("BlueEdit", x6, currentY, x6-x5-cs, editHeight, 1.0, 0.0, 255.0, 5));

    local colourCB = WidgetUtils.createComboBox("ColourComboBox", x7, currentY, x8-x7, editHeight);
    widget:addChild(colourCB);

        item = new("osgUI::Item");
        item.Text="bone";
        item.Color = {r=1.0,g=1.0,b=0.0,a=1.0};
        colourCB.Items:add(item);

        item = new("osgUI::Item");
        item.Text="skin";
        item.Color = {r=1.0,g=1.0,b=1.0,a=1.0};
        colourCB.Items:add(item);

        item = new("osgUI::Item");
        item.Text="muscle";
        item.Color = {r=1.0,g=0.0,b=0.0,a=1.0};
        colourCB.Items:add(item);





    widget:createGraphicsImplementation();





end

return widget;
end

