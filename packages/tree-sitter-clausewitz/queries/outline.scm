(type_declaration
	(keyword)
	name: (identifier) @class.name
	parent: (reference)
) @class

(assign_statement
	left: (identifier) @variable.name
	right: (scope)
) @variable

(property_assigment
	left: (property) @field.name
) @field