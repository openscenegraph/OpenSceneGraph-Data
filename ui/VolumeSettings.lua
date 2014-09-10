local widget = new("osgUI::Dialog");
widget.Name = "VolumeSettingsDialog";

widget.load = function(widget, filename)

    newVolumeSettings = readObjectFile(filename);

    if (newVolumeSettings) then
        print("Loaded VolumeSettings file "..filename);
        if (widget.VolumeSettings) then
            vs = widget.VolumeSettings;
            vs.Technique = newVolumeSettings.Technique;
            vs.ShadingModel = newVolumeSettings.ShadingModel;
            vs.SampleRatio = newVolumeSettings.SampleRatio;
            vs.SampleRatioWhenMoving = newVolumeSettings.SampleRatioWhenMoving;
            vs.Cutoff = newVolumeSettings.Cutoff;
            vs.Transparency = newVolumeSettings.Transparency;
        else
            widget.VolumeSettings = newVolumeSettings;
        end

        widget.VolumeSettings.Filename = filename;

        widget.WidgetsUpated = false;
        widget:updateWidgets();
    end

end

widget.save = function(widget, filename)

    vs = widget.VolumeSettings;
    if (filename == nil) then filename = vs.Filename; end
    if (filename == nil) then filename = "VolumeSettings.lua"; end

    vs.Filename = "";
    vs.Name = "";

    print("Saving VolumeSettings to file:"..filename);
    writeFile(vs, filename);

    vs.Filename = filename;
    vs.Name = "VolumeSettings";
end



widget.getWidget = function(widget, name)
    local numChildren = widget:getNumChildren();
    for i=0, numChildren-1 do
        local node = widget:getChild(i);
        if (node.Name==name) then return node; end
    end
    return nil;
end

widget.updateLineEdit = function(widget, name, value)

    editWidget = widget:getWidget(name);
    if (not editWidget) then return end;

    if (type(value)=="table") then
        if (value.ModifiedCount ~= editWidget.ModifiedCount) then
            editWidget.ModifiedCount = value.ModifiedCount;
            editWidget.Text = value.Value;
        end
    else
        editWidget.Text = value;
    end
end

widget.updateComboBox = function(widget, name, value)

    cbWidget = widget:getWidget(name);
    if (not cbWidget) then return end;

    -- print("Updating combobox", cbWidget);

    for i=0, cbWidget.Items:size()-1 do
        print("  checking item ", i, cbWidget.Items[i].Text);
        if (cbWidget.Items[i].Text==value) then
            cbWidget.CurrentIndex = i;
            print("Set current item",i,value);
        end
    end
end

widget.updateWidgets = function(widget)

    if (not widget.VolumeSettings) then return; end;

    widget.WidgetsUpated = true;

    vs = widget.VolumeSettings;

    --print("vs.ModifiedCount=", vs.ModifiedCount, " widget.ModifiedCount=",widget.ModifiedCount);

    if (widget.ModifiedCount~=vs.ModifiedCount) then
        print("Need to update FilenameEdit etc.");
        widget:updateLineEdit("FilenameEdit", vs.Filename);
        widget:updateComboBox("TechniqueComboBox", vs.Technique);
        widget:updateComboBox("ShadingModelComboBox", vs.ShadingModel);
    end


    widget:updateLineEdit("SampleRatioEdit", vs.SampleRatioProperty);
    widget:updateLineEdit("SampleRatioWhenMovingEdit", vs.SampleRatioWhenMovingProperty);
    widget:updateLineEdit("CutoffEdit", vs.CutoffProperty);
    widget:updateLineEdit("TransparencyEdit", vs.TransparencyProperty);

    widget.ModifiedCount = vs.ModifiedCount;

end

widget.getEditValue = function(widget, name)
    editWidget = widget:getWidget(name);
    if (editWidget) then return editWidget.Text end;
    return nil;
end

widget.copyEditValueToProperty = function(widget, name, property)
    editWidget = widget:getWidget(name);
    if (editWidget) then
        property.Value = editWidget.Text;
        editWidget.ModifiedCount = property.ModifiedCount;
    end;
    return nil;
end

widget.getComboBoxValue = function(widget, name)
    cbWidget = widget:getWidget(name);
    if (cbWidget) then return cbWidget.Items[cbWidget.CurrentIndex].Text end;
    return nil;
end

widget.updateVolumeSettings = function(widget)

    if (not(widget.VolumeSettingsUpdated)) then return; end

    print("------   widget.updateVolumeSettings -------");

    widget.VolumeSettingsUpdated = false;

    if (not widget.VolumeSettings) then
        widget.VolumeSettings = new("osgVolume::VolumeSettings");
    end;

    local vs = widget.VolumeSettings;

    vs.Filename = widget:getEditValue("FilenameEdit");
    vs.Technique = widget:getComboBoxValue("TechniqueComboBox");
    vs.ShadingModel = widget:getComboBoxValue("ShadingModelComboBox");

    widget:copyEditValueToProperty("SampleRatioEdit", vs.SampleRatioProperty);
    widget:copyEditValueToProperty("SampleRatioWhenMovingEdit", vs.SampleRatioWhenMovingProperty);
    widget:copyEditValueToProperty("CutoffEdit", vs.CutoffProperty);
    widget:copyEditValueToProperty("CutoffEdit", vs.IsoSurfaceProperty);
    widget:copyEditValueToProperty("TransparencyEdit", vs.TransparencyProperty);

    widget.ModifiedCount = vs.ModifiedCount;
end

widget.createGraphics = function(widget)

    print("Running widget.createGraphics");

    local function createLabel(name, text, x, y, width, height)
        local label = new("osgUI::Label");
        label.Name = name;
        label.Extents = {xMin=x, yMin=y, zMin=0, xMax=x+width, yMax=y+height, zMax=0};
        label.Text = text;
        label.TextSettings = ts;
        label.AlignmentSettings = as;
        return label;
    end

    local function createComboBox(name, x, y, width, height, ...)
        local cb = new("osgUI::ComboBox");
        cb.Name = name;
        cb.Extents = {xMin=x, yMin=y, zMin=0, xMax=x+width, yMax=y+height, zMax=0};
        cb.TextSettings = ts;
        cb.FrameSettings = raisedFs;

        local as = new("osgUI::AlignmentSettings");
        as.Alignment = "CENTER_CENTER";

        cb.AlignmentSettings = as;

        for i,v in ipairs({...}) do
            if (type(v)=="function") then
                print("\n\n******* FOUND FUNCTION FOR COMBOBOX *********");
                cb.currentIndexChanged = v;
            else
                item = new("osgUI::Item");
                item.Text=v;
                -- item.Color = {r=1.0,g=1.0,b=0.0,a=0.0};
                cb.Items:add(item);
            end
        end

        return cb;
    end

    local VolumeSettingsWidgetUpdated = function(widget, value)
        local dialog = GetNamedNodeFromParentalChain(widget, "VolumeSettingsDialog");
        if (dialog) then
            dialog.VolumeSettingsUpdated = value;
        end
    end

    local ComboBoxIndexChanged = function(widget, value)
        print("Lua function callback : ComboBoxIndexChanged");
        VolumeSettingsWidgetUpdated(widget, true);
        widget:currentIndexChangedImplementation(value);
    end

    local function createButton(name, x, y, width, height, text, pressedCallback)
        local pb = new("osgUI::PushButton");
        pb.Name = name;
        pb.Extents = {xMin=x, yMin=y, zMin=0, xMax=x+width, yMax=y+height, zMax=0};
        pb.TextSettings = ts;
        pb.AlignmentSettings = centerAlignment;
        pb.FrameSettings = raisedFs;
        pb.Text = text;
        pb.released = pressedCallback;
        return pb;
    end


    local LineEditLeave = function(widget)
        print("Lua function callback : LineEditLeave");
        widget:leaveImplementation();
        if (widget.changed) then
            VolumeSettingsWidgetUpdated(widget, true);
            widget.changed = false;
        end
    end

    local LineEditUpdated = function(widget)
        print("Lua function callback : LineEditUpdated");
        if (widget.changed) then
            VolumeSettingsWidgetUpdated(widget, true);
            widget.changed = false;
        end
    end

    local LineEditChanged = function(widget)
        print("Lua function callback : LineEditChanged");
        -- VolumeSettingsWidgetUpdated(widget, true);
        widget.changed = true;
    end


    local function createLineEdit(name, x, y, width, height, text, minValue, maxValue, numDecimals)
        local le = new("osgUI::LineEdit");
        le.Name = name;
        le.Extents = {xMin=x, yMin=y, zMin=0, xMax=x+width, yMax=y+height, zMax=0};
        le.TextSettings = ts;
        le.AlignmentSettings = as;
        le.FrameSettings = fs;
        le.Text = text;

        if (minValue and maxValue) then
            le.Validator = new("osgUI::DoubleValidator");
            le.Validator.Bottom = minValue;
            le.Validator.Top = maxValue;

            if (numDecimals) then
                le.Validator.Decimals = numDecimals;
            end
        end

        le.returnPressed = LineEditUpdated;
        le.textChanged = LineEditChanged;
        le.leave = LineEditLeave;

        return le;
    end


    GetVolumeSettingsFromParentalChain = function(node)

        if (node.VolumeSettings) then return node.VolumeSettings; end

        if (node:getNumParents()>0) then

            for i=0, node:getNumParents()-1 do
                local vs = GetVolumeSettingsFromParentalChain(node:getParent(i));
                if (vs) then return vs; end
            end
        else
            return nil;
        end
    end

    GetNamedNodeFromParentalChain = function(node, name)

        if (node.Name==name) then return node; end

        if (node:getNumParents()>0) then

            for i=0, node:getNumParents()-1 do
                local matchedNode = GetNamedNodeFromParentalChain(node:getParent(i), name);
                if (matchedNode) then return matchedNode; end
            end
        else
            return nil;
        end
    end

    local FilePressed = function(widget)
        print("file Pressed", widget);
        widget:releasedImplementation();
    end

    local LoadPressed = function(widget)
        print("load Pressed", widget);

        local dialog = GetNamedNodeFromParentalChain(widget, "VolumeSettingsDialog");
        if (dialog) then
            local filenameWidget = dialog:getWidget("FilenameEdit");
            if (filenameWidget) then
                local filename = filenameWidget.Text;
                dialog:load(filename);
            end
        else
            print("Could not find dialog widget");
        end

        widget:releasedImplementation();
    end

    local SavePressed = function(widget)
        print("save Pressed", widget);

        local dialog = GetNamedNodeFromParentalChain(widget, "VolumeSettingsDialog");
        if (dialog) then
            local filenameWidget = dialog:getWidget("FilenameEdit");
            local filename = filenameWidget.Text;
            dialog:save(filename);
        else
            print("Could not find dialog widget");
        end

        widget:releasedImplementation();
    end

    local cs = 5.0;
    local lg = cs*1.5;
    local labelWidth = cs*13.0;
    local labelHeight = cs*1.3;
    local editWidth = cs*7.0;
    local editHeight = labelHeight;
    local dialogHeight = lg*7.4;
    local currentY = dialogHeight-lg;
    local currentX = cs;
    local rightCurrentX = currentX+labelWidth+lg
    local dialogWidth = rightCurrentX+editWidth+cs;


    ts = new("osgUI::TextSettings");
    ts.Font = "times.ttf";
    ts.CharacterSize = cs;

    as = new("osgUI::AlignmentSettings");
    as.Alignment = "LEFT_CENTER";

    centerAlignment = new("osgUI::AlignmentSettings");
    centerAlignment.Alignment = "CENTER_CENTER";

    fs = new("osgUI::FrameSettings");
    fs.LineWidth = 0.5;
    fs.Shape = "BOX";
    fs.Shadow = "SUNKEN";

    editFs = new("osgUI::FrameSettings");
    editFs.LineWidth = 0.5;
    editFs.Shape = "PANEL";
    editFs.Shadow = "SUNKEN";

    raisedFs = new("osgUI::FrameSettings");
    raisedFs.LineWidth = 0.5;
    raisedFs.Shape = "BOX";
    raisedFs.Shadow = "RAISED";

    dfs = new("osgUI::FrameSettings");
    dfs.LineWidth = 1.0;
    dfs.Shape = "BOX";
    dfs.Shadow = "RAISED";

    widget.Title = "Volume Settings Editor";
    widget.Extents = {xMin=0, yMin=0, zMin=0, xMax=dialogWidth, yMax=dialogHeight, zMax=0};
    widget.TextSettings = ts;
    widget.FrameSettings = dfs;

    local margin = cs*0.35;
    local filenameLabelWidth = cs*4.25;
    local filenameEditX = currentX+filenameLabelWidth+margin;
    local filenameEditWidth = cs*9.0;
    local filenameButtonX = filenameEditX+filenameEditWidth+margin;
    local filenameButtonWidth = cs*1.0;
    local loadButtonX = filenameButtonX + filenameButtonWidth+margin;
    local loadButtonWidth = cs*3.0;
    local saveButtonX = loadButtonX + loadButtonWidth+margin;
    local saveButtonWidth = cs*3.0;

    widget:addChild(createLabel("FilenameLabel", "Filename", currentX, currentY, filenameLabelWidth, labelHeight));
    widget:addChild(createLineEdit("FilenameEdit", filenameEditX, currentY, filenameEditWidth, editHeight, "filename"));
    widget:addChild(createButton("FilenameButton", filenameButtonX, currentY, filenameButtonWidth, editHeight, "...", FilePressed));
    widget:addChild(createButton("LoadButton", loadButtonX, currentY, loadButtonWidth, editHeight, "Load", LoadPressed));
    widget:addChild(createButton("SaveButton", saveButtonX, currentY, saveButtonWidth, editHeight, "Save", SavePressed));
    currentY = currentY-lg;

    widget:addChild(createLabel("TechniqueLabel", "Technique", currentX, currentY, labelWidth, labelHeight));
    widget:addChild(createComboBox("TechniqueComboBox", rightCurrentX, currentY, editWidth, editHeight, ComboBoxIndexChanged, "FixedFunction", "RayTraced", "MultiPass"));
    currentY = currentY-lg;

    widget:addChild(createLabel("ShadingModelLabel", "Shading Model", currentX, currentY, labelWidth, labelHeight));
    widget:addChild(createComboBox("ShadingModelComboBox", rightCurrentX, currentY, editWidth, editHeight, ComboBoxIndexChanged, "Standard", "Light", "Isosurface", "MaximumIntensityProjection"));
    currentY = currentY-lg;

    widget:addChild(createLabel("SampleRatioLabel", "Sample Ratio", currentX, currentY, labelWidth, labelHeight));
    widget:addChild(createLineEdit("SampleRatioEdit", rightCurrentX, currentY, editWidth, editHeight, 1.0, 0.0, 1.0, 5));
    currentY = currentY-lg;

    widget:addChild(createLabel("SampleRatioWhenMovingLabel", "Sample Ratio When Moving", currentX, currentY, labelWidth, labelHeight));
    widget:addChild(createLineEdit("SampleRatioWhenMovingEdit", rightCurrentX, currentY, editWidth, editHeight, 1.0, 0.0, 1.0, 5));
    currentY = currentY-lg;

    widget:addChild(createLabel("CutoffLabel", "Cutoff", currentX, currentY, labelWidth, labelHeight));
    widget:addChild(createLineEdit("CutoffEdit", rightCurrentX, currentY, editWidth, editHeight, 0.0, 0.0, 1.0, 5));
    currentY = currentY-lg;

    widget:addChild(createLabel("TransparencyLabel", "Transparency", currentX, currentY, labelWidth, labelHeight));
    widget:addChild(createLineEdit("TransparencyEdit", rightCurrentX, currentY, editWidth, editHeight, 1.0, 0.0, 1.0, 5));
    currentY = currentY-lg;


    widget.WidgetsUpated = false;
    widget:updateWidgets();

    widget:createGraphicsImplementation();

end

widget.traverse = function (widget, visitor)

    -- print("widget.traverse ", visitor);

    if (widget.ModifiedCount~=widget.VolumeSettings.ModifiedCount) then
        print("\nWidget has been modified\n");
        --widget.ModifiedCount = widget.VolumeSettings.ModifiedCount;
    end

    local needToSyncWidgets = (visitor.VisitorType == "EVENT_VISITOR");
    if (needToSyncWidgets) then
        widget:updateWidgets();
    end

    widget:traverseImplementation(visitor);

    if (needToSyncWidgets) then
        widget:updateVolumeSettings();
    end

end

widget:createGraphics();
--widget:load("vs.osgt");
-- widget.VolumeSettings = new("osgVolume::VolumeSettings");

return widget;
