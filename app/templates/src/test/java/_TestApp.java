<%= codeHeader %>
package <%= packageName %>;

import org.junit.Test;
import org.junit.Assert;

public class <%= testClassName %> {

	@Test
	public void testAppName() throws Exception {
        Assert.assertEquals("<%= testClassName %>", this.getClass().getSimpleName());
	}

}
