
local cs = 5.0;
local ts = new("osgUI::TextSettings");
ts.Font = "times.ttf";
ts.CharacterSize = cs;

local as = new("osgUI::AlignmentSettings");
as.Alignment = "LEFT_CENTER";

local centerAlignment = new("osgUI::AlignmentSettings");
centerAlignment.Alignment = "CENTER_CENTER";

local tabFrameSettings = new("osgUI::FrameSettings");
tabFrameSettings.Shadow = "RAISED";
tabFrameSettings.LineWidth = 0.5;

-- set up main dialog
local widget = new("osgUI::Dialog");
widget.Title = "My Tabbed Dialog";
widget.Extents = {xMin=0.0, yMin=0.0, zMin=0.0, xMax=100.0, yMax=100.0, zMax=0.0};
widget.TextSettings = ts;
widget.AlignmentSettings = centerAlignment;

-- set up TabWidget
local tabWidget = new("osgUI::TabWidget");
tabWidget.Extents = {xMin=5.0, yMin=5.0, zMin=0.0, xMax=90.0, yMax=90.0, zMax=0.0};
tabWidget.TextSettings = ts;
tabWidget.AlignmentSettings = as;
tabWidget.FrameSettings = tabFrameSettings;
widget:addChild(tabWidget);


-- Set up first Tab
local tabOne = new("osgUI::Tab");
tabOne.Text = "One";

local labelOne = new("osgUI::Label");
labelOne.Text = "This is my label One";
labelOne.Extents = {xMin=10.0, yMin=10.0, zMin=0.0, xMax=90.0, yMax=20.0, zMax=0.0};
labelOne.TextSettings = ts;
labelOne.AlignmentSettings = as;
tabOne.Widget = labelOne;
tabWidget.Tabs:add(tabOne);

-- Set up second Tab
local tabTwo = new("osgUI::Tab");
tabTwo.Text = "Two";

local labelTwo = new("osgUI::Label");
labelTwo.Text = "This is my label Two";
labelTwo.Extents = {xMin=10.0, yMin=10.0, zMin=0.0, xMax=90.0, yMax=20.0, zMax=0.0};
labelTwo.TextSettings = ts;
labelTwo.AlignmentSettings = as;
tabTwo.Widget = labelTwo;
tabWidget.Tabs:add(tabTwo);

-- Set up second Tab
local tabThree = new("osgUI::Tab");
tabThree.Text = "Three";

local labelThree = new("osgUI::Label");
labelThree.Text = "This is my label Three";
labelThree.Extents = {xMin=10.0, yMin=10.0, zMin=0.0, xMax=90.0, yMax=20.0, zMax=0.0};
labelThree.TextSettings = ts;
labelThree.AlignmentSettings = as;
tabThree.Widget = labelThree;
tabWidget.Tabs:add(tabThree);

widget:createGraphics();
tabWidget.CurrentIndex = 0;

return widget;

