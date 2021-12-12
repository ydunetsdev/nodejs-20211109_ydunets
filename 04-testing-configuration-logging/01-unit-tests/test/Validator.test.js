const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('тип "string", cледует добавить объект в ошибки и выдать ошибку что строка слишком короткая', () => {
      const obj = {
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      }
      const value = { name: 'Lalala' }
      const validator = new Validator(obj);
      const errors = validator.validate(value);

      expect(errors).to.have.length(1);
      expect(errors[0]).to.eql({field: "name", error: `too short, expect ${obj.name.min}, got ${value.name.length}`})
    });

    it('тип "string", cледует добавить объект в ошибки и выдать ошибку что строка слишком длинная', () => {
      const obj = {
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      }
      const value = { name: 'Lalalalalalalalalalala' }
      const validator = new Validator(obj);
      const errors = validator.validate(value);

      expect(errors).to.have.length(1);
      expect(errors[0]).to.eql({field: "name", error: `too long, expect ${obj.name.max}, got ${value.name.length}`})
    });

    it('тип "number" cледует добавить объект в ошибки и выдать ошибку что возраст мал', () => {
      const obj = {
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      }
      const value = { age: 16 }
      const validator = new Validator(obj);
      const errors = validator.validate(value);

      expect(errors).to.have.length(1);
      expect(errors[0]).to.eql({field: "age", error: `too little, expect ${obj.age.min}, got ${value.age}`})
    });

    it('тип "number" cледует добавить объект в ошибки и выдать ошибку что возраст cлишком большой', () => {
      const obj = {
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      }
      const value = { age: 29 }
      const validator = new Validator(obj);
      const errors = validator.validate(value);

      expect(errors).to.have.length(1);
      expect(errors[0]).to.eql({field: "age", error: `too big, expect ${obj.age.max}, got ${value.age}`})
    });

    it('валидатор запишет ошибку, что ожидался другой тип', () => {
      const obj = {
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      };
      const validator = new Validator(obj)
      const value = {name: 18};
      const errors = validator.validate(value);

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(
          `expect ${obj.name.type}, got ${typeof value.name}`,
      );
    });
  })
})