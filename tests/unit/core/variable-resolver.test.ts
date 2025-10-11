/**
 * Unit tests for VariableResolver
 */

import { VariableResolver } from '../../../src/core/variable-resolver';
import { VariableScope } from '../../../src/models/variables';

describe('VariableResolver', () => {
  let resolver: VariableResolver;

  beforeEach(() => {
    resolver = new VariableResolver();
  });

  describe('Single Scope Resolution', () => {
    it('should resolve variables from a single scope', () => {
      resolver.setScope(VariableScope.GLOBAL, { name: 'John', age: '30' });

      expect(resolver.resolve('Hello {{name}}')).toBe('Hello John');
      expect(resolver.resolve('Age is {{age}}')).toBe('Age is 30');
    });

    it('should not resolve undefined variables', () => {
      resolver.setScope(VariableScope.GLOBAL, { name: 'John' });

      expect(resolver.resolve('Hello {{name}} {{unknown}}')).toBe('Hello John {{unknown}}');
    });
  });

  describe('Multiple Scope Resolution with Precedence', () => {
    it('should apply correct precedence: Local > Collection > Environment > Global', () => {
      resolver.setScope(VariableScope.GLOBAL, { var: 'global-value' });
      resolver.setScope(VariableScope.ENVIRONMENT, { var: 'env-value' });
      resolver.setScope(VariableScope.COLLECTION, { var: 'collection-value' });
      resolver.setScope(VariableScope.LOCAL, { var: 'local-value' });

      expect(resolver.resolve('{{var}}')).toBe('local-value');
    });

    it('should fall back to lower precedence when variable not in higher scope', () => {
      resolver.setScope(VariableScope.GLOBAL, { var1: 'global', var2: 'global' });
      resolver.setScope(VariableScope.ENVIRONMENT, { var2: 'env', var3: 'env' });
      resolver.setScope(VariableScope.LOCAL, { var3: 'local' });

      expect(resolver.resolve('{{var1}}')).toBe('global');
      expect(resolver.resolve('{{var2}}')).toBe('env');
      expect(resolver.resolve('{{var3}}')).toBe('local');
    });

    it('should merge variables from all scopes', () => {
      resolver.setScope(VariableScope.GLOBAL, { global1: 'g1', global2: 'g2' });
      resolver.setScope(VariableScope.ENVIRONMENT, { env1: 'e1', env2: 'e2' });
      resolver.setScope(VariableScope.COLLECTION, { col1: 'c1' });
      resolver.setScope(VariableScope.LOCAL, { local1: 'l1' });

      const merged = resolver.getMergedVariables();

      expect(merged.global1).toBe('g1');
      expect(merged.env1).toBe('e1');
      expect(merged.col1).toBe('c1');
      expect(merged.local1).toBe('l1');
    });
  });

  describe('Object Resolution', () => {
    beforeEach(() => {
      resolver.setScope(VariableScope.GLOBAL, {
        name: 'John',
        age: '30',
        city: 'New York',
      });
    });

    it('should resolve variables in objects', () => {
      const obj = {
        userName: '{{name}}',
        userAge: '{{age}}',
        location: '{{city}}',
      };

      const resolved = resolver.resolveObject(obj);

      expect(resolved).toEqual({
        userName: 'John',
        userAge: '30',
        location: 'New York',
      });
    });

    it('should resolve nested objects', () => {
      const obj = {
        user: {
          name: '{{name}}',
          details: {
            age: '{{age}}',
            city: '{{city}}',
          },
        },
      };

      const resolved = resolver.resolveObject(obj);

      expect(resolved).toEqual({
        user: {
          name: 'John',
          details: {
            age: '30',
            city: 'New York',
          },
        },
      });
    });

    it('should resolve arrays', () => {
      const obj = {
        names: ['{{name}}', 'Alice', '{{name}}'],
      };

      const resolved = resolver.resolveObject(obj);

      expect(resolved).toEqual({
        names: ['John', 'Alice', 'John'],
      });
    });
  });

  describe('Scope Management', () => {
    it('should clear a specific scope', () => {
      resolver.setScope(VariableScope.GLOBAL, { var: 'global' });
      resolver.setScope(VariableScope.LOCAL, { var: 'local' });

      expect(resolver.resolve('{{var}}')).toBe('local');

      resolver.clearScope(VariableScope.LOCAL);

      expect(resolver.resolve('{{var}}')).toBe('global');
    });

    it('should clear all scopes', () => {
      resolver.setScope(VariableScope.GLOBAL, { var: 'global' });
      resolver.setScope(VariableScope.LOCAL, { var: 'local' });

      resolver.clearAll();

      expect(resolver.resolve('{{var}}')).toBe('{{var}}'); // Not resolved
    });

    it('should get variables from specific scope', () => {
      resolver.setScope(VariableScope.GLOBAL, { global1: 'g1' });
      resolver.setScope(VariableScope.LOCAL, { local1: 'l1' });

      const globalVars = resolver.getScopeVariables(VariableScope.GLOBAL);
      const localVars = resolver.getScopeVariables(VariableScope.LOCAL);

      expect(globalVars).toEqual({ global1: 'g1' });
      expect(localVars).toEqual({ local1: 'l1' });
    });
  });

  describe('Variable Queries', () => {
    beforeEach(() => {
      resolver.setScope(VariableScope.GLOBAL, { var1: 'value1' });
      resolver.setScope(VariableScope.LOCAL, { var2: 'value2' });
    });

    it('should check if variable exists', () => {
      expect(resolver.hasVariable('var1')).toBe(true);
      expect(resolver.hasVariable('var2')).toBe(true);
      expect(resolver.hasVariable('var3')).toBe(false);
    });

    it('should get variable value', () => {
      expect(resolver.getVariable('var1')).toBe('value1');
      expect(resolver.getVariable('var2')).toBe('value2');
      expect(resolver.getVariable('var3')).toBeUndefined();
    });
  });
});

