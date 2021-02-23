const db = require('../db')
const { createHash } = require('../util/crypt')
const { tables: { ACCOUNTS, CHANGES } } = require('../cosntants/db')

class Account {
  static async getById(id) {
    const res = await db.query(`SELECT * FROM ${ACCOUNTS} where id = $1`, [id])
    return res.rows[0]
  }

  static async findByName(name) {
    const res = await db.query(`SELECT * FROM ${ACCOUNTS} where name = $1`, [name])
    return res.rows[0]
  }

  static create(name, password, amount = 1000) {
    return db.query(`INSERT INTO ${ACCOUNTS} (name, password, amount) VALUES($1, $2, $3)`, [name, createHash(password), amount])
  }

  static setById(id, amount) {
    return db.query(`UPDATE ${ACCOUNTS} SET amount = $1 where id = $2`, [amount, id])
  }

  static transfer(from, to, amount) {
    return Account._transferInternal(from, to, amount, 'REPEATABLE READ')
  }

  static _transferReadCommitted(from, to, amount) {
    return Account._transferInternal(from, to, amount, 'READ COMMITTED')
  }

  static _transferSerializable(from, to, amount) {
    return Account._transferInternal(from, to, amount, 'SERIALIZABLE')
  }

  static _transferInternal(from, to, amount, isolationLevel) {
    from = parseInt(from)
    to = parseInt(to)

    if (from === to) {
      throw Error('self transfer detected')
    }
    amount = escape(`${amount}`)

    return db.query(`
         START TRANSACTION ISOLATION LEVEL ${isolationLevel};
            DO
            $$DECLARE
              from_amount ${ACCOUNTS}.amount%TYPE;
              to_amount ${ACCOUNTS}.amount%TYPE;
            BEGIN
              SELECT amount INTO STRICT from_amount FROM ${ACCOUNTS} WHERE id = ${from};
              IF from_amount < ${amount} THEN
                RAISE EXCEPTION 'insufficient funds';
              END IF;
              SELECT amount INTO STRICT to_amount FROM ${ACCOUNTS} WHERE id = ${to};
                        
              UPDATE ${ACCOUNTS} SET amount = from_amount - ${amount} WHERE id = ${from};
              UPDATE ${ACCOUNTS} SET amount = to_amount + ${amount} WHERE id = ${to};
            
              INSERT INTO ${CHANGES} (from_id, to_id, was_from, was_to, transfer_amount) VALUES (${from}, ${to}, from_amount, to_amount, ${amount});
            END$$;
         COMMIT TRANSACTION;
        `)
  }
}

module.exports = Account