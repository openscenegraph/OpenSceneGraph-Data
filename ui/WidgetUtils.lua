local WidgetUtils = {}

print("---------- Setting up WidgetUtils---------------------");

function WidgetUtils.createLabel (name, text, x, y, width, height)

    local label = new("osgUI::Label");
    label.Name = name;
    label.Extents = {xMin=x, yMin=y, zMin=0, xMax=x+width, yMax=y+height, zMax=0};
    label.Text = text;
    label.TextSettings = ts;
    label.AlignmentSettings = as;
    return label;

end

function WidgetUtils.createComboBox(name, x, y, width, height, ...)

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

function WidgetUtils.createButton(name, x, y, width, height, text, pressedCallback)

    local pb = new("osgUI::PushButton");
    pb.Name = name;
    pb.Extents = {xMin=x, yMin=y, zMin=0, xMax=x+width, yMax=y+height, zMax=0};
    pb.TextSettings = ts;
    pb.AlignmentSettings = centerAlignment;
    pb.FrameSettings = raisedFs;
    pb.Text = text;

    if (pressedCallback) then pb.released = pressedCallback; end
    return pb;

end

function WidgetUtils.createLineEdit(name, x, y, width, height, text, minValue, maxValue, numDecimals, returnPressedCallback, textChangedCallback, leaveCallback)

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

    if (returnPressedCallback) then le.returnPressed = retrunPressedCallback; end
    if (textChangedCallback) then le.textChanged = textChangedCallback; end
    if (leaveCallback) then le.leave = leaveCallback; end

    return le;

end

return WidgetUtils;
