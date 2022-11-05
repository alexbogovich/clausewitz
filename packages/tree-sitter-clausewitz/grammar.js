const
  letter = /[a-zA-Z]/,
  decimal_digit = /[0-9]/
  octal_digit = /[0-7]/
  hex_digit = /[0-9A-Fa-f]/;

module.exports = grammar({
    name: 'clausewitz',

    extras: $ => [
      $.comment,
      /[\s\p{Zs}\uFEFF\u2060\u200B]/,
    ],
  
    rules: {
      source_file: $ => repeat($._top_level_statement),

      _top_level_statement: $ => choice(
        $.type_namespace,
        $.assign_statement,   
      ),

      type_namespace: $ => seq(
        alias('types', $.keyword),
        field('name', $.identifier),
        '{',
        repeat($.type_declaration),
        '}',
      ),

      type_declaration: $ => seq(
        alias('type', $.keyword), 
        field('name', $.identifier), 
        '=', 
        optional(field('parent', $._reference)), 
        field('body', $.scope)
      ),

      assign_statement: $ => prec.left(choice(
        seq(field('left', $.identifier), '=', field('right', choice(
          $._value,
          $.enum_value,
        ))),
      )),

      scope: $ => prec.right(seq(
        '{',
        repeat(choice($.block_definition, $.property_assigment)),
        '}',
      )),

      append_child: $ => seq(
        field('left', $._reference),
        '=',
        $.scope
      ),

      block_definition: $ => seq(alias('block', $.keyword), field('name', $.string), field('body', $.scope)),

      block_override: $ => seq(alias('blockoverride', $.keyword), field('name', $.string,), field('body', $.scope)),

      identifier: $ => token(seq(
        optional('@'),
        letter,
        optional(repeat(choice(
          letter,
          decimal_digit,
          '_',
        ))),
      )),

      condition: $ => seq($._value, "=", $._value),

      _reference: $ => alias($.identifier, $.reference),

      enum_value: $ => seq($.identifier, ':', $.identifier),

      _property: $ => alias($.identifier, $.property),

      _value: $ => prec(-1, choice(
        $._reference,
        $.integer,
        $.float_value,
        $.string,
        $.array,
        $.scope,
        $.enum_value,
      )),

      property_assigment: $ => seq(field('left', $._property), '=', field('right', $._value)),

      array: $ => prec.right(seq(
        '{',
        repeat1($._value),
        '}'
      )),
      
      string: $ => choice(
        seq(
          '"',
          repeat(choice(
            alias($.unescaped_double_string_fragment, $.string_fragment),
            $.escape_sequence
          )),
          '"'
        ),
        seq(
          "'",
          repeat(choice(
            alias($.unescaped_single_string_fragment, $.string_fragment),
            $.escape_sequence
          )),
          "'"
        )
      ),

      unescaped_double_string_fragment: $ =>
        token.immediate(prec(1, /[^"\\]+/)),

      unescaped_single_string_fragment: $ =>
        token.immediate(prec(1, /[^'\\]+/)),

      escape_sequence: $ => token.immediate(seq(
        '\\',
        choice(
          /[^xu0-7]/,
          /[0-7]{1,3}/,
          /x[0-9a-fA-F]{2}/,
          /u[0-9a-fA-F]{4}/,
          /u{[0-9a-fA-F]+}/
        )
      )),

      integer: $ => seq(
        token(seq(
          optional(choice('+', '-')),
          /\d+/
        )),
      ),

      float_value: $ => seq(
        token(seq(
          optional(choice('+', '-')),
          /\d*/,
          choice(
            seq('.', /\d+/),
            seq(/[eE]/, optional('-'), /\d+/),
            seq('.', /\d+/, /[eE]/, optional('-'), /\d+/)
          )
        )),
      ),

      comment: $ => token(choice(
        seq('#', /.*/),
      )),
    }
  });