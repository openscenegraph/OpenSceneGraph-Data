-- $Id: osgwidgetwindow.lua 50 2008-05-06 05:06:36Z cubicool $

--[[
Table = {}

function Table:new()
	local t = {}

	setmetatable(t, self)

	self.__index = self

	return t
end

function Table:__concat(other)
	return tostring(self) .. other
end

function Table:foo(x)
	print("foo: " .. self .. x.x)
	print(self .. x.x)
end

Table.__metatable = "Protected"

t1 = Table:new()
t2 = Table:new()

t1:foo{x="hello", y="world"}

-- Other stuff...
]]--

print("Our exising window var is: " .. window)

w = osgwidget.newWidget()

print("A new Widget is: " .. w)
